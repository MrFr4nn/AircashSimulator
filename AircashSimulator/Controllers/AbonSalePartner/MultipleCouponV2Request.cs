using System.Collections.Generic;
using System;

namespace AircashSimulator
{
	public class MultipleCouponV2Request
	{
		public Guid PartnerId { get; set; }
		public string PointOfSaleId { get; set; }
		public string ISOCurrencySymbol { get; set; }
		public string ContentType { get; set; }
		public int? ContentWidth { get; set; }
		public List<MultipleCouponCreationRequestDenomination> Denominations { get; set; }
        public List<CustomParameter> CustomParameters { get; set; }
    }

	public class CustomParameter
	{
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
