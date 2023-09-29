import {JSX, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {FaChevronDown, FaSearch} from "react-icons/fa";
import * as React from "react";
import {AnimatePresence, motion} from "framer-motion";
const FETCH_URL: string = import.meta.env.VITE_FETCH_URL;
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
enum animType {
  SPRING = "spring",
  TWEEN = "tween"
}
export default function App(): JSX.Element {
  const [countries, setCountries] = useState<ICountries[] | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const change = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value.toLowerCase());
  }
  const setValue = (e: React.SyntheticEvent<HTMLLIElement> | string): void => {
    setSelected(e.target.innerText);
    setShowDropDown(false);
  }
  const truncate = (str: string, len: number): string => {
    return str.length > len ? str.substring(0, len) + "..." : str;
  }
  const showDropDownMenu = (): void => {
    setShowDropDown(!showDropDown);
  }
  const getCountries = async (): Promise<void> => {
    try {
      const res: AxiosResponse = await axios.get(FETCH_URL);
      if (res) { setCountries(res?.data) }
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    getCountries();
  }, []);
  return (
    <>
      <div className={"flex justify-center h-screen w-full bg-gray-700"}>
        <div className={"w-[350px] select-none"}>
          <div
            onClick={showDropDownMenu}
            className={"flex items-center cursor-pointer h-10 px-2 justify-between w-full bg-gray-600 capitalize font-bold rounded-md mt-2 select-none text-gray-400"}
          >
            {selected ? truncate(selected, 30) : "select country"}
            <FaChevronDown size={22} className={`${showDropDown && "rotate-180 duration-300"} duration-300 pointer-events-none`}/>
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
                  duration: 0.35,
                  type: `${animType.TWEEN}`
                }}
                className={"w-full bg-gray-600 rounded-md mt-2 py-1 overflow-y-auto text-gray-400 relative"}
              >
                <div className="px-1 relative">
                  <FaSearch size={18} className={"absolute left-2.5 top-1/2 transform -translate-y-1/2"}/>
                  <input
                    type="text"
                    placeholder={"search..."}
                    value={inputValue}
                    onChange={change}
                    className={"w-full h-10 rounded-md bg-gray-600 transition pl-8 duration-200 border-none outline-none px-2 focus:bg-gray-700"}
                  />
                </div>
                {countries?.map((item) => (
                  <li
                    key={item.name.common}
                    onClick={setValue}
                    className={`
                      ${item.name.common.toLowerCase() === selected.toLowerCase() 
                        ? "bg-gray-700" 
                        : ""
                      }
                      ${item.name.common.toLowerCase().startsWith(inputValue) 
                        ? "block" 
                        : "hidden"
                      } py-2 bg-gray-600 my-0.5 cursor-pointer font-medium hover:bg-gray-800 px-2 relative hover:before:w-1 hover:before:h-full hover:before:absolute hover:before:bg-gray-500 hover:before:left-0 hover:before:top-0`
                    }
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
