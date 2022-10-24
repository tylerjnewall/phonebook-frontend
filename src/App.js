import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const App = ({ props }) => {
  const [contacts, setContacts] = useState([]);
  const [hidden, setHidden] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    getAllContacts();
  }, []);

  function getAllContacts() {
    axios
      .get("https://localhost:7013/api/phonebook/contacts")
      .then((res) => {
        setContacts(res.data);
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
      });
  }

  let onSubmit = async (data) => {
    try {
      let res = await fetch(
        "https://localhost:7013/api/phonebook/create-contact",
        {
          method: "POST",
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            number: data.number,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let resJson = await res.json();
      if (res.status === 200) {
        contacts.push(data);
        setHidden(true);
        console.log(contacts);
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  let removeContact = async (contactId) => {
    try {
      let res = await fetch(
        `https://localhost:7013/api/phonebook/delete-contact/?contactid=${contactId}`,
        {
          method: "DELETE",
        }
      );
      if (res.status === 200) {
        setContacts(
          contacts.filter((contact) => contact.contactId !== contactId)
        );
        setHidden(true);
      } else {
      }
    } catch (err) {
      console.log(err);
    }

    console.log(contactId);
  };

  let closeForm = () => {
    setSelectedContact(null);
    setHidden(true);
  };

  return (
    <div>
      <h1 className="text-3xl text-blue-500 text-center mt-10">
        Phonebook project
      </h1>

      <div className="w-full max-w-xs mx-auto my-5 mt-20">
        <div>
          <div className="flex justify-end">
            <button
              className="bg-blue-500 px-2 rounded text-white py-2 mb-6"
              onClick={() => setHidden(!hidden)}
            >
              Add contact
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`bg-white px-8 pt-6 pb-8 mb-4 mt-4 ${
              hidden ? "hidden" : ""
            }`}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                First name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                type="text"
                onChange={(e) => {}}
                {...register("firstName", { required: true })}
                aria-invalid={errors.firstName ? "true" : "false"}
              />
              {errors.firstName?.type === "required" && (
                <p className="text-red-500" role="alert">
                  First name is required
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="lastName"
                {...register("lastName", { required: true })}
                aria-invalid={errors.lastName ? "true" : "false"}
              />
              {errors.lastName?.type === "required" && (
                <p className="text-red-500" role="alert">
                  Last name is required
                </p>
              )}
              <div className="">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="number"
                >
                  Phone number
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="number"
                  {...register("number", { required: true })}
                  aria-invalid={errors.number ? "true" : "false"}
                />
                {errors.number?.type === "required" && (
                  <p className="text-red-500" role="alert">
                    Phone number is required
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {selectedContact !== null ? "Update" : "Create"}
              </button>
              <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="#"
                onClick={() => closeForm()}
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
        <p className="text-center text-gray-500 text-xs"></p>
        <div>
          {contacts.length == 0 ? (
            <div>No contacts</div>
          ) : (
            contacts.map((contact) => {
              return (
                <div className=" mb-5" key={contact.contactId}>
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <span
                      className="text-red-500"
                      onClick={() => removeContact(contact.contactId)}
                    >
                      remove
                    </span>
                  </div>
                  <p className="text-gray-400">{contact.number}</p>
                  <hr className="mt-3" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
