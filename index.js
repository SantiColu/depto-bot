const axios = require('axios');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { getApartmentDetail, getApartments } = require("./browser")
const { getPrevApartments, addApartment } = require("./db.js")
const { BASE_URL, SEARCH_URL, WEBHOOK_URL } = require('./config')

async function main() {
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch();

  await refreshApartments(browser)

  setInterval(() => {
    refreshApartments(browser)
  }, 30 * 60 * 1000)

  // await browser.close();
}

async function refreshApartments(browser) {
  console.log('Buscando departamentos...')
  try {

    let apartmentsCounter = 0
    const newApartments = await getApartments(browser, SEARCH_URL)
    const prevApartments = await getPrevApartments()
    console.log(newApartments.length, 'departamentos scrappeados')

    for (const apartment of newApartments) {
      if (prevApartments.indexOf(apartment) === -1) {
        prevApartments.push(apartment)
        addApartment(apartment)
        const apartmentDetail = await getApartmentDetail(browser, BASE_URL + apartment)
        await notify(apartmentDetail)
        apartmentsCounter++
      }
    }

    console.log(apartmentsCounter, 'departamentos nuevos encontrados')

  } catch (e) {
    console.log('Se produjo un error buscando departamentos...')
  }
  console.log("\n")
}

async function notify({ url, price, date, ubication, title, images }) {
  let mensaje = ""
  if (title) mensaje += `**${title}**\n`
  if (ubication) mensaje += `**Ubicacion:** ${ubication}\n`
  if (price) mensaje += `**Precio:** ${price}\n`
  if (date) mensaje += `**Listado:** ${date}\n`
  mensaje += url

  const now = new Date()

  await axios({
    url: WEBHOOK_URL,
    method: 'post',
    data: {
      avatar_url: "https://www.zonaprop.com.ar/noticias/wp-content/uploads/2019/10/zp-04.png",
      username: "DeptoBot",
      embeds: [{
        author: {
          name: "DeptoBot",
          icon_url: "https://www.zonaprop.com.ar/noticias/wp-content/uploads/2019/10/zp-04.png"
        },
        title: "Nuevo departamento listado! [Abrir]",
        description: mensaje ?? "Sin informacion disponible",
        color: 2031360,
        url,
        footer: {
          text: `Terrible bot papu - ${now.toLocaleTimeString()}`,
          icon_url: "https://www.zonaprop.com.ar/noticias/wp-content/uploads/2019/10/zp-04.png"
        },
        image: {
          url: images[0] ?? null
        },
        thumbnail: {
          url: images[1] ?? null
        }
      }],
    }
  })
}


main()
