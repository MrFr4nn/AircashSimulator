using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace AircashSimulator.Extensions
{
    public static class Extensions
    {
        public static bool EqualsAnyOf<T>(this T objectToComapre, params T[] paramsToCompareWith)
        {
            if (paramsToCompareWith == null)
                throw new ArgumentNullException("paramsToCompareWith");
            foreach (var p in paramsToCompareWith)
            {
                if (p.Equals(objectToComapre))
                    return true;
            }
            return false;
        }
        /// <summary>
        /// Check if collection is empty or null.
        /// </summary>
        /// <typeparam name="T">Data type.</typeparam>
        /// <param name="list">Input collection.</param>
        /// <returns>Returns true if collection is null or empty. Else return false.</returns>
        public static bool IsNullOrEmpty<T>(this IEnumerable<T> list)
        {
            return list == null || !list.Any();
        }
        /// <summary>
        /// Check if collection is not empty or null.
        /// </summary>
        /// <typeparam name="T">Data type.</typeparam>
        /// <param name="list">Input collection.</param>
        /// <returns>Returns true if collection is not null or empty. Else return false.</returns>
        public static bool IsNotNullOrEmpty<T>(this IEnumerable<T> list)
        {
            return list != null && list.Any();
        }
        /// <summary>
        /// Creates a HashSet collection of the collection.
        /// </summary>
        /// <typeparam name="T">Element type.</typeparam>
        /// <param name="list">List to process.</param>
        /// <returns>HashSet collection of the collection.</returns>
        public static HashSet<T> ToHashSet<T>(this IEnumerable<T> list)
        {
            return new HashSet<T>(list);
        }

        /// <summary>
        /// Extension method on enumerable list that will split that list into batches.
        /// </summary>
        /// <typeparam name="T">Element type.</typeparam>
        /// <param name="list">List to process.</param>
        /// <param name="batchSize">Batch size must be greater then 0.</param>
        /// <returns>Return list of lists </returns>
        public static IEnumerable<IEnumerable<T>> Batch<T>(this IEnumerable<T> list, int batchSize)
        {
            if (batchSize <= 0)
                throw new ArgumentOutOfRangeException("chunkSize", batchSize, "Chunk size cannot be less than or equal to zero.");

            if (list == null)
                throw new ArgumentNullException("list", "Input to be split cannot be null.");

            var cellCounter = 0;
            var chunk = new List<T>(batchSize);

            foreach (var item in list)
            {
                chunk.Add(item);
                cellCounter++;

                if (cellCounter == batchSize)
                {
                    yield return chunk;
                    chunk = new List<T>(batchSize);
                    cellCounter = 0;
                }
            }
            if (chunk.Count > 0)
                yield return chunk;
        }

        public static int ParseToInt(this string value, int defaultValue = 0)
        {
            int result;
            if (int.TryParse(value, out result))
                return result;
            return defaultValue;
        }

        /// <summary>
        /// Gets the value from the dictionary or the default value if the item is not found.
        /// </summary>
        /// <typeparam name="TKey">Key data type.</typeparam>
        /// <typeparam name="TValue">Value data type.</typeparam>
        /// <param name="dict">Dictionary to get from.</param>
        /// <param name="key">Key of the item to get.</param>
        /// <returns>Item value if found or the default value it the item with the given key was not found.</returns>
        public static TValue GetValueOrDefault<TKey, TValue>(this Dictionary<TKey, TValue> dict, TKey key)
        {
            TValue val;
            dict.TryGetValue(key, out val);
            return val;
        }

        /// <summary>
        /// Extracts the given property names in a string array.
        /// Copies properties from the given entity.
        /// </summary>
        /// <typeparam name="TEntity">Element type.</typeparam>
        /// <param name="entityTo">Entity to which to copy the propery values.</param>
        /// <param name="entityFrom">Entity from which to copy the propery values.</param>
        /// <param name="skipPrimaryKeyProperties">True to skip copying of primary key properties, false to include them. Default is false.</param>
        /// <param name="skipProperties">List of properties to skip.</param>
        public static string[] PropertyList<TEntity>(this TEntity entityTo, params Expression<Func<TEntity, object>>[] propertySelector)
        {
            return propertySelector != null ? propertySelector.Select(x => GetPath(x)).ToArray() : null;
        }

        /// <summary>
        /// Get property name from expression.
        /// </summary>
        /// <typeparam name="T">Object type.</typeparam>
        /// <param name="expression">Array of expressions.</param>
        /// <returns>Return enumerator containing property names.</returns>
        public static IEnumerable<string> GetPropertyNames<T>(this Expression<Func<T, object>>[] expression)
        {
            var type = typeof(T);
            if (!type.IsClass || type.IsAbstract)
                throw new ArgumentException("Wrong type of object type. T can only be class that isn't abstract.");
            var instance = Activator.CreateInstance<T>();
            var listProps = expression.ToList();
            var listPropertyNames = new List<string>();
            listProps.ForEach(x => listPropertyNames.Add(instance.PropertyList(x).FirstOrDefault()));
            return listPropertyNames;
        }

        static string GetPath(Expression exp)
        {
            switch (exp.NodeType)
            {
                case ExpressionType.MemberAccess:
                    var name = GetPath(((MemberExpression)exp).Expression) ?? "";

                    if (name.Length > 0)
                        name += ".";

                    return name + ((MemberExpression)exp).Member.Name;

                case ExpressionType.Convert:
                case ExpressionType.Quote:
                    return GetPath(((UnaryExpression)exp).Operand);

                case ExpressionType.Lambda:
                    return GetPath(((LambdaExpression)exp).Body);

                default:
                    return null;
            }
        }

        public static Expression<Func<T, bool>> AndAlso<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
        {
            return first.Compose(second, Expression.AndAlso);
        }

        public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> first, Expression<Func<T, bool>> second)
        {
            return first.Compose(second, Expression.Or);
        }

        public static Expression<T> Compose<T>(this Expression<T> first, Expression<T> second, Func<Expression, Expression, Expression> merge)
        {
            // build parameter map (from parameters of second to parameters of first)
            var map = first.Parameters.Select((f, i) => new { First = f, Second = second.Parameters[i] }).ToDictionary(p => p.Second, p => p.First);
            // replace parameters in the second lambda expression with parameters from the first
            var secondBody = ParameterRebinder.ReplaceParameters(map, second.Body);
            // apply composition of lambda expression bodies to parameters from the first expression 
            return Expression.Lambda<T>(merge(first.Body, secondBody), first.Parameters);
        }

        #region string
        public static string LimitLength(this string value, int maxLength)
        {
            if (maxLength <= 0)
                throw new ArgumentOutOfRangeException("maxLength", "MaxLength must be greater than 0.");
            if (value == null)
                return null;
            return value.Substring(0, Math.Min(value.Length, maxLength));
        }
        /// <summary>
        /// Compare two strings and with ignore case in invariant culture option.
        /// </summary>
        /// <param name="value">String that we comapre.</param>
        /// <param name="valueToComapare">Second string that we compare with.</param>
        /// <returns>Return true incase they are equal of false otherwise.</returns>
        public static bool EqualsIgonreCase(this string value, string valueToComapare)
        {
            return string.Equals(value, valueToComapare, StringComparison.InvariantCultureIgnoreCase);
        }
        #endregion
    }
    public class ParameterRebinder : ExpressionVisitor
    {
        readonly Dictionary<ParameterExpression, ParameterExpression> map;

        public ParameterRebinder(Dictionary<ParameterExpression, ParameterExpression> map)
        {
            this.map = map ?? new Dictionary<ParameterExpression, ParameterExpression>();
        }
        public static Expression ReplaceParameters(Dictionary<ParameterExpression, ParameterExpression> map, Expression exp)
        {
            return new ParameterRebinder(map).Visit(exp);
        }
        protected override Expression VisitParameter(ParameterExpression p)
        {
            ParameterExpression replacement;
            if (map.TryGetValue(p, out replacement))
                p = replacement;
            return base.VisitParameter(p);
        }
    }
}
