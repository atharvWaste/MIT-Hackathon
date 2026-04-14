import {useNavigate } from "react-router-dom";
import { useState } from "react";
const PageOne = ()=>{
const [loading, setLoading] = useState(false);
const Navigate = useNavigate();

const handleTransition1 =()=>{
    setLoading(true);

   Navigate('/Login')
}

const handleTransition2 =()=>{
    setLoading(true);

   Navigate('/SignIn')
}
    

    return(
       <div>
        <button onClick={handleTransition1}>Login</button>
       <button onClick={handleTransition2}>Signin</button>
       </div>
    )
}

export default PageOne