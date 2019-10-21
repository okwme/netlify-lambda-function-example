

const $messageBox = document.getElementById('messageBox');
const $button = document.querySelector('button');

const stripe = Stripe(STRIPE_PUBLISHABLE_KEY)

if (window.location.hash === '#thankyou') {
  $messageBox.querySelector('h2').innerHTML = 'Thank you!';
}

$button.addEventListener('click', async () => {

  let plan = document.getElementById("plan_select").value

  const response = await fetch(LAMBDA_ENDPOINT + '/session', {
    method: 'POST',
    body: JSON.stringify({
      plan
    }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  const data = await response.json();
  const sessionId = data.checkoutSessionId
  stripe.redirectToCheckout({
    sessionId
  }).then((result) => {
    console.log({result})
  }).catch((error) => {
    console.log({error})
  })
});
