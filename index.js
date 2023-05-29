import { Configuration, OpenAIApi } from 'openai'
import { process } from './env'

let inputArray = {}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

document.getElementById('submit-btn').addEventListener('click', () => {
  inputArray['travelBudget'] = document.getElementById('input-budget').value
  inputArray['travelDesc'] = document.getElementById('input-desc').value
  inputArray['travelPartner'] = document.getElementById('travel-partner').value
  inputArray['travelType'] = document.getElementById('travel-type').value
  inputArray['travelArea'] = document.getElementById('travel-area').value

  console.log(inputArray)

  // getCopySuggestion(
  //   inputArray['travelBudget'],
  //   inputArray['travelDesc'],
  //   inputArray['travelDesc']
  // )
  fetchAIreply()
})

async function getCopySuggestion(productName, productDesc, productTarget) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',

    /*    
Challenge:
  1. Add a second example here. Be sure to make it similar in design to the first.
  2. Remember to use separators 
*/

    prompt: `Use a product name, a product description and a target market to create advertising copy for a product.
    ###
    product name: Flask Tie
    product description: A tie with a pouch to hold liquids and a straw to drink through
    product traget market: office workers
    advertising copy: Are you tired of having to worry about how much to drink throughout the day? With the Flask Tie, you can stay hydrated on-the-go! Our unique tie features a pouch that enables you to securely hold and sip your favorite drinks with the built-in straw! The water cooler is history! Long live Flask Tie!
    ###
    product name: SolarSwim
    product description: Swimming costumes for all genders with solar cells to charge your devices while you sunbathe.
    product traget market: young adults
    advertising copy: Don't miss a beat while you're having fun in the sun! SolarSwim is the perfect choice for the tech-savvy, on-the-go millennial. Our innovative swimming costumes come with integrated solar cells that allow you to charge and access your devices while you're at the beach or pool. Enjoy your summer break with SolarSwim!
    ###
    product name: ${productName}
    product description: ${productDesc}
    product traget market: ${productTarget}
    advertising copy: 
    `,
    max_tokens: 100,
  })

  document
    .getElementById('ad-output')
    .insertAdjacentText('beforeend', response.data.choices[0].text.trim())
  document.getElementById('ad-input').style.display = 'none'
  document.getElementById('ad-output').style.display = 'block'
  console.log(response)
}

async function fetchAIreply() {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate a short message to enthusiastically preferences sound like a good and interesting plan and that you need some minutes to think about it. 
    
    ###
    Preferences: 12,000 HKD; beach holiday; family-friendly, Europe
    message: Wow, a beach holiday in Europe sounds like a fantastic idea! With a budget of 12,000 HKD and a preference for a family-friendly trip, you're in for a great time. Let me take a few seconds to come up with a plan that suits your preferences. Stay tuned!
    ###
    Preferences: ${inputArray['travelBudget']}; ${inputArray['travelPartner']}; ${inputArray['travelArea']}; ${inputArray['travelType']}
    message:
    `,
    temperature: 1,
    max_tokens: 70,
    top_p: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  const waitMessage = response.data.choices[0].text.trim()
  document.getElementById('ad-input').style.display = 'none'
  document.getElementById('output-container').style.display = 'flex'
  document.getElementById('output-container').innerHTML = waitMessage
}
