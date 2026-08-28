import { useEffect, useState} from "react"

function useDebounce(
    value,
    delay = 600
){
    const [ debouncedValue, setDebouncedValue] = useState(value);

    // run a useEffect
    useEffect(()=>{

    // create a timer 
    const timer = setTimeout(()=>{setDebouncedValue(value)}, delay);

    return () => {
        clearTimeout(timer);
    }},[value, delay])

    return debouncedValue;
}

export default useDebounce;