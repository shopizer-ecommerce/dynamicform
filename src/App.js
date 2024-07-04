import { Routes, Route, Outlet, useSearchParams, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Dialog } from '@headlessui/react';
import DatePicker from "react-datepicker";
import { request } from 'graphql-request';
import "react-datepicker/dist/react-datepicker.css";
import { Error, Success } from './components'

import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'


function App() {


  return (
    <>

      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Form />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Form />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  );
}

function Layout() {
  return (
    <>


      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      {/*
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>

      <hr />
      */}

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </>
  );
}


function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Form() {

  const [searchParams] = useSearchParams();
  let product = searchParams.get('product');
  console.log('product is' + product);
  let productSku = '';
  if(product) {
    productSku = ' - ' + product;
  }


  //dynamic form
  const endpoint = `https://ca-central-1.cdn.hygraph.com/content/clu02mxdl017i07wb3byzu3w9/master`;


  const CONTENT_QUERY2 = `
  query QuotationForms {
    quotationForm(where: {id: "clu0hcykh9hln07u47pm3ulp8"}) {
      id
      detailsCampagne
      titreCampagne
      image {
        url
      }
    }
  }
`
  
  var date = new Date(); // Now
  date.setDate(date.getDate() + 30); // Set now + 30 days as the new date
  const [content, setContent] = useState(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState();
  const [errors, setErrors] = useState([]);

  const [form, setForm] = useState({
    name : "",
    subject : "",
    email_phone : "",
    email_date : date,
    fromEmail : "",
    email_address : "",
    email_details : "",
    app : "PERFECTOGAZ"
  })

  const client = axios.create({
    //baseURL: "https://eilgrzlvu9.execute-api.ca-central-1.amazonaws.com/prod"
    baseURL: "https://fwy7giz3og.execute-api.ca-central-1.amazonaws.com/prod" 
  });


  useEffect(() => {
    setSuccess(false);
    const fetchContent = async () => {
      const c  = await request(endpoint, CONTENT_QUERY2)
      setContent(c);
      productSku = '';
      setTitle("Demande " + c.quotationForm?.titreCampagne);
      //console.log('content ' + JSON.stringify(content));
    };
    setContent("");
    setTitle("Demande d'informations" + productSku);
    if(product === null) {
      fetchContent();
    }
  }, []);

  const handleFormSubmit = async (e) => {
  
    e.preventDefault();

    //validate required fiends
    //name
    //email
    //details
    var errorMissing = [];
    if(form.name === "") {
      errorMissing.push("Le nom complet est requis");
    }
    if(form.email === "") {
      errorMissing.push("Le courriel est requis");
    }
    if(form.email_details === "") {
      errorMissing.push("Le detail du projet est requis");
    }
    console.log(JSON.stringify(form));
    console.log(JSON.stringify(errorMissing));
    console.log('Number of errors ' + errorMissing.length);
    form.subject = title;
    setErrors(errorMissing);
    if(errorMissing.length === 0) {
      setSending(true);
      client
      .post('https://fwy7giz3og.execute-api.ca-central-1.amazonaws.com/prod', {
         email: form
      })
      .then((response) => {
         console.log('Response' + JSON.stringify(response));
         setSuccess(true);
         setSending(false);
      });
    }

  }

  return (
    <span>
    {/** HEADER */}
     <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">Perfectogaz</span>
          <img src="/perfectogaz-logo.png" height={60} alt="Perfectogaz" />
        </a>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="https://perfectogaz.com" className="text-sm font-semibold leading-6 text-gray-900">
            Perfectogaz <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </header>


    <div className="mx-auto mt-8 max-w-7xl px-6 sm:mt-16 lg:px-8">

    {errors.length>0 && <Error title="Erreur de validation" errors={errors} />}
    {success && <Success title="Envoi de message réussi" text="Votre message a été envoyé avec succès" />}


     {/** FORM */}
     <div className="relative">

    {/** SPINNER */}

     {sending &&
     <div className="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
        <div className="flex items-center">
          <span className="text-3xl mr-4">Envoi de la demande</span>
          <svg className="animate-spin h-8 w-8 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>
      </div>
      }


    <form noValidate onSubmit={handleFormSubmit}>
      <div className="space-y-12 pl-10 pr-10">
        <div className="border-b border-gray-900/10 pb-12">

        {
          !content ? (
            
              ''
                    ) : (
                      <React.Fragment>

                        <div className="overflow-hidden bg-white py-2 sm:py-2">
                              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                                  <div className="lg:pr-8 lg:pt-4">
                                    <div className="lg:max-w-lg">
                                      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{content.quotationForm.titreCampagne}</p>
                                      <p className="mt-6 text-lg leading-8 text-gray-600">
                                        {content.quotationForm.detailsCampagne}
                                      </p>
                                    </div>
                                  </div>
                                  <img className="w-[22rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[26rem] md:-ml-4 lg:-ml-0" src={content.quotationForm?.image?.url} alt="Perfectogaz" />
                                </div>
                              </div>
                            </div>

                      </React.Fragment>
                
                    )
        }
          <h2 className="mt-16 text-base font-semibold leading-7 text-gray-900">Demande d'informations{productSku}</h2>


          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Nom complet
              </label>
              <div className="mt-2">
              <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e)=>setForm({...form, name:e.target.value})}
                  id="name"
                  autoComplete="given-name"
                  placeholder="Nom complet"
                  className="invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Courriel
              </label>
              <div className="mt-2">
                <input
                  id="fromEmail"
                  name="fromEmail"
                  type="fromEmail"
                  value={form.fromEmail}
                  onChange={(e)=>setForm({...form, fromEmail:e.target.value})}
                  placeholder=" Courriel"
                  autoComplete="email"
                  //pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="email_phone"
                      id="email_phone"
                      autoComplete="tel"
                      value={form.email_phone}
                      onChange={(e)=>setForm({...form, email_phone:e.target.value})}
                      placeholder="Téléphone"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                Votre adresse
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="email_adresse"
                  id="email_adresse"
                  autoComplete="street-address"
                  value={form.email_address}
                  onChange={(e)=>setForm({...form, email_address:e.target.value})}
                  placeholder="Addresse"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                Date prévue
              </label>
              <div className="mt-2">
                  <DatePicker selected={new Date(form.email_date)} onChange={(d) =>setForm({...form, email_date: d})} />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                Détails de la demande
              </label>
              <div className="mt-2">
                <textarea
                  id="details"
                  name="email_details"
                  rows={3}
                  value={form.email_details}
                  onChange={(e)=>setForm({...form, email_details:e.target.value})}
                  placeholder="Détails de la demande"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Annuler
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Envoyer
        </button>
      </div>
    </form>

    </div>
    </div>
    </span>
           


  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}


export default App;
