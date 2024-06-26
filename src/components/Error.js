const Error = ({ title, errors }) => (
    <div className="bg-red-50 rounded-md p-3 flex margin-bottom-10">
      <svg
        className="stroke-2 stroke-current text-red-600 h-8 w-8 mr-2 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 0h24v24H0z" stroke="none" />
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h0" />
      </svg>
  
      <div className="text-red-700">
        <div className="font-bold text-xl">{title}</div>
        {
          //errors.forEach((er) => <span>hello</span>)

          //JSON.stringify(errors)
          JSON.stringify(errors)
        }
      </div>
    </div>
  );

  {/**  Messages {errors.length} {JSON.stringify(errors)} */}

  export default Error;