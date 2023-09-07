using AircashFrame;
using AircashSimulator.Controllers.AircashFrame;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Mvc;
using Services.AircashATM;
using Services.AircashFrameV2;
using Services.CobrandedCard;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.CobrandedCard
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CobrandedCardController : ControllerBase
    {
        private ICobrandedCardService CobrandedCardService;
        public CobrandedCardController(ICobrandedCardService cobrandedCardService)
        {
            CobrandedCardService = cobrandedCardService;
        }

        [HttpPost]
        public async Task<IActionResult> OrderCard(CobrandedCardDTO request)
        {
            var cardRequest = new OrderCardRequest
            {
                PhoneNumber = request.PhoneNumber,
                PartnerID = request.PartnerID,
                PartnerCardID = request.PartnerCardID,
                PartnerUserID = request.PartnerUserID,
                CardTypeID = request.CardTypeID,
                PersonalID = request.PersonalID,
                FirstName = request.FirstName,
                LastName = request.LastName,
                NameOnCard= request.NameOnCard,
                DeliveryTypeID = request.DeliveryTypeID,
                Street= request.Street,
                City= request.City,
                PostalCode= request.PostalCode,
                Country= request.Country
            };
            var response = await CobrandedCardService.OrderNewCard(cardRequest);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> UpdateCardStatus(UpdateStatusCardDTO request)
        {
            var updateCardStatusRequest = new UpdateStatusCardRQ
            {
                PartnerID = request.PartnerID,
                PartnerCardID = request.PartnerCardID,
                OldStatus = request.OldStatus,
                NewStatus=request.NewStatus,
                DenialStatusDetails=request.DenialStatusDetails
            };
            var response = await CobrandedCardService.UpadateCardStatus(updateCardStatusRequest);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> UpdateCardOrderStatus(UpdateCardOrderStatusDTO request)
        {
            var updateCardStatusRequest = new UpdateCardOrderStatusRQ
            {
                CardID = request.CardID,
                NewUser=request.NewUser,
            };
            var response = await CobrandedCardService.UpdateCardOrderStatus(updateCardStatusRequest);
            return Ok(response);
        }
    }
}
