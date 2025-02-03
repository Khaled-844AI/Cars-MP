import React from 'react'

function Section1() {
  return (
    <section>
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
      <div className="grid place-content-center rounded bg-gray-100 p-6 sm:p-8">
        <div className="mx-auto max-w-md text-center lg:text-left">
          <header>
            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">Cars</h2>

            <p className="mt-4 text-gray-500">
              Still searching for a car ? what are you waiting for here is the Cars land Find your Car !
            </p>
          </header>


            <a
              href='/shop'
              className="mt-8 inline-block rounded border border-gray-900 bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:shadow focus:outline-none focus:ring"
            >
              Shop All
            </a>

        </div>
      </div>

      <div className="lg:col-span-2 lg:py-8">
        <ul className="grid grid-cols-2 gap-4">
          <li>
            <a href="#" className="group block">
              <img
                src="https://images.pexels.com/photos/4906981/pexels-photo-4906981.jpeg"
                alt=""
                className="aspect-square w-[full] rounded object-cover"
              />

            </a>
          </li>

          <li>
            <a href="#" className="group block">
              <img
                src="https://www.autocar.co.uk/sites/autocar.co.uk/files/toyota-land-cruiser-review-2024-01-watersplash.jpg"
                alt=""
                className="aspect-square w-full rounded object-cover"
              />

            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
  )
}

export default Section1