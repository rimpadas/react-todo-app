import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

interface Address {
  city: string;
  street: string;
  suite: string;
  zipcode: string;
}

interface CompanyDetails {
  name: string;
}

interface UserDataDetails {
  id: string;
  name: string;
  email: string;
  company: CompanyDetails;
  phone: string;
  website: string;
  address: Address;
}

export default function UserList() {
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserDataDetails[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDataDetails>();
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    const filteredData: UserDataDetails[] = userData.filter((e) =>
      e.name.toLowerCase().includes(searchKeyword)
    );

    if (filteredData) {
      setUserData(filteredData);
    }
  }, [searchKeyword]);

  useEffect(() => {
    async function getData() {
      const fetchAPI = "https://jsonplaceholder.typicode.com/users";
      setLoadingState(true);
      try {
        const response = await fetch(fetchAPI);
        if (!response.ok) {
          setLoadingState(false);
          toast.error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        setUserData(result);
        setLoadingState(false);
      } catch (error) {
        setLoadingState(false);
        toast.error(error.message);
      }
    }
    getData();
  }, []);

  return (
    <div>
      <h1 className="text-lg font-semibold pb-5">User List</h1>
      <div>
        <label>User Search: </label>
        <input
          className="border pb-2 border-gray-500"
          type="text"
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>
      {loadingState ? (
        <div>Loading...</div>
      ) : (
        <div className="relative mt-5 overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
          <table className="w-full text-sm text-left rtl:text-right text-body">
            <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Company Name
                </th>
                <th scope="col" className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {userData.map((el: UserDataDetails) => (
                <tr className="bg-neutral-primary border-b border-default">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {el.name}
                  </th>
                  <td className="px-6 py-4">{el.email}</td>
                  <td className="px-6 py-4">{el.company.name}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        openModal();
                        setUserDetails(el);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal}>close</button>
        <h2>User Details</h2>

        <div>Name: {userDetails?.name}</div>
        <div>Email: {userDetails?.email}</div>
        <div>Phone: {userDetails?.phone}</div>

        <div>Website: {userDetails?.website}</div>
        <div>
          Address: {userDetails?.address.suite} {userDetails?.address.street}{" "}
          {userDetails?.address.city} {userDetails?.address.zipcode}
        </div>
        <div>Company: {userDetails?.company.name}</div>
      </Modal>
    </div>
  );
}
