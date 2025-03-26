import React from 'react'
import Sidebar from "../components/Sidebar";
import Header from '../components/Header';

const Eventos = () => {
  return (
    <div> 
        <div className="flex min-h-screen bg-[#0D1F2D]">
                <Sidebar/>
                <div className="flex-1">
                    <Header />
                </div>
            </div>
    </div>
  )
}

export default Eventos