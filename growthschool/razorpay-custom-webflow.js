// Author: Prateek Kumar
// Email: prateek@epyc.in
// Website: https://askprateek.com


function makeRazorpayPayment(index) {
  var razorpayButtons = $(".razorpay-payment-button .PaymentButton");
  razorpayButtons[index].click();
}

function attachPaymentListener() {
  const button1 = $("[data-payment='1']");
  const button2 = $("[data-payment='2']");

  const buttons = [button1, button2];
  buttons.forEach(function (button, index) {
    if (button) {
          button.on("click", function () {
            makeRazorpayPayment(index);
          });
    }

  });
}
$(document).ready(function () {
  attachPaymentListener();
});
