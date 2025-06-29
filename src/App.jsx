import React from 'react'
import { ScrollTrigger, SplitText } from 'gsap/all';
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
  return (
    <div className='text-3xl text-amber-500 flex-center'>
      APP
    </div>
  )
}

export default App
