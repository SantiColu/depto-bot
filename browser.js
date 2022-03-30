const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

function sanitizeData({ price, title, date, ubication, images }) {

  return {
    price: price.slice(1, price.length - 2),
    ubication: ubication.split("\n")[1]?.split(",")[0],
    title,
    images,
    date,
  }
}

async function getApartments(browser, searchUrl) {
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false)
  await page.goto(searchUrl);

  const apartments = await page.evaluate(() => {
    const elements = document.querySelector("#react-posting-cards > div")?.children
    if (!elements) return []
    const elements_arr = Array.from(elements)
    const links = elements_arr?.map(element => element.getAttribute("data-to-posting"))
    return links?.filter(v => v !== null)
  })

  await page.close()
  return apartments
}

async function getApartmentDetail(browser, url) {
  const incognitoBrowser = await browser.createIncognitoBrowserContext();
  const page = await incognitoBrowser.newPage();
  await page.goto(url, { timeout: 60000 });

  const data = await page.evaluate(() => {
    const price = document.querySelector("#article-container > div.posting-price > div.price-container > div > div > div > div.price-items > span > span")?.textContent
    const title = document.querySelector("#article-container > div.posting-price > div.price-container > h2")?.textContent
    const date = document.querySelector("#user-views > div > div:nth-child(1) > p")?.textContent
    const ubication = document.querySelector("#article-container > hgroup > h2")?.textContent

    const rawImages = document.querySelector("#react-gallery")?.children
    let images = []
    if (rawImages) {
      images = Array.from(rawImages).map(img => img.children[0]?.getAttribute("src"))?.filter(v => v !== null)
    }

    return {
      price,
      title,
      date,
      ubication,
      images
    }
  })

  await page.close()
  await sleep(2000)
  return {
    url,
    ...sanitizeData(data)
  }
}

module.exports = {
  getApartments,
  getApartmentDetail
}