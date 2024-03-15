using AircashSignature;
using System;
using System.Collections.Generic;

namespace Services.AbonSalePartner
{
	public class MultipleCouponABONV2Request : ISignature
	{
		public Guid PartnerId { get; set; }
		public string PointOfSaleId { get; set; }
		public string ISOCurrencySymbol { get; set; }
		public string ContentType { get; set; }
		public int? ContentWidth { get; set; }
		public List<AbonDenomination> Denominations { get; set; }
        public List<CustomParameter> CustomParameters { get; set; }
        public string Signature { get; set; }
    }

	public class CustomParameter
	{
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
