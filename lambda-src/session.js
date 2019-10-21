require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const statusCode = 200;
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = async function(event) {
  // We only care to do anything if this is our POST request.
  if (event.httpMethod !== "POST") {
    return {
      statusCode,
      headers,
      body: "This was not a POST request!"
    };
  }
  
  // Parse the body contents into an object.
  const data = JSON.parse(event.body);

  // Make sure we have all required data. Otherwise, get outta here.
  if (!data.plan) {
    const message = "Required information is missing!";
    console.error(message);
    return {
      statusCode,
      headers,
      body: JSON.stringify({
        status: "failed",
        message
      })
    };
  }

  const plan = data.plan
  let session;

  try {
    session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        subscription_data: {
            items: [{plan}],
        },
        success_url: process.env.WEBSITE + '#thankyou',
        cancel_url:  process.env.WEBSITE,
      }
    );
  } catch (e) {
    console.error(e.message);

    return {
      statusCode: 424,
      headers,
      body: JSON.stringify({
        status: "failed",
        message: e.message
      })
    };
  }

  console.log({session})
  const status = session.status;

  return {
    statusCode,
    headers,
    body: JSON.stringify({
      status,
      checkoutSessionId: session.id
    })
  };
};
