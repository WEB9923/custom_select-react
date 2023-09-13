import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import * as React from "react";
import {AnimatePresence, motion} from "framer-motion";

interface ICountries {
  name: {
    common: string,
    nativeName: {
      ara: {
        common: string,
        official: string
      }
    },
    official: string
  }
}
export default function App() {
  const [countries, setCountries] = useState<ICountries[] | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  //fn
  const change = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value.toLowerCase());
  }
  const setValue = (e: React.SyntheticEvent): void => {
    setSelected(e.target.innerText);
    setShowDropDown(false);
  }
  const truncate = (str: string, len: number): string => {
    return str.length > len ? str.slice(0, len) + "..." : str;
  }
  const showDropDownMenu = (): void => {
    setShowDropDown(!showDropDown);
  }
  const getCountries = async (): Promise<void> => {
    try {
      const res: AxiosResponse = await axios.get("https://restcountries.com/v3.1/all?fields=name&flags");
      if (res) { setCountries(res?.data) }
    } catch (err) {
      console.error(err);
    }
  }
  //effect
  useEffect(() => {
    getCountries();
  }, []);
  console.log(selected)
  return (
    <>
      <div className={"flex justify-center h-screen w-full bg-gray-700"}>
        <div className={"w-[350px]"}>
          <div
            onClick={showDropDownMenu}
            className={"flex items-center cursor-pointer h-10 px-2 justify-between w-full bg-gray-600 capitalize font-bold rounded-md mt-2 select-none text-gray-400"}
          >
            {selected ? truncate(selected, 30) : "select"}
            {!showDropDown
              ? <FaChevronDown size={22}/>
              : <FaChevronUp size={22}/>
            }
          </div>
          <AnimatePresence>
            {showDropDown &&
              <motion.ul
                initial={{
                  height: 0,
                }} animate={{
                  height: "450px",
                }} exit={{
                  height: 0,
                }} transition={{
                  duration: 0.2,
                  type: "spring",
                  stiffness: 60
                }}
                className={"w-full bg-gray-600 rounded-md mt-2 overflow-y-auto text-gray-400 py-1 relative"}
              >
                <div className="px-1">
                  <input
                    type="text"
                    placeholder={"search..."}
                    value={inputValue}
                    onChange={change}
                    className={"w-full h-10 rounded-md bg-gray-600 transition duration-200 border-none outline-none px-2 focus:bg-gray-700"}
                  />
                </div>
                {countries?.map((item) => (
                  <li
                    key={item.name.common}
                    onClick={setValue}
                    className={"py-2 bg-gray-600 my-0.5 cursor-pointer hover:bg-gray-700 px-2 relative hover:before:w-1 hover:before:h-full hover:before:absolute hover:before:bg-gray-500 hover:before:left-0 hover:before:top-0"}
                  >
                    {item.name.common}
                  </li>
                ))}
              </motion.ul>}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
