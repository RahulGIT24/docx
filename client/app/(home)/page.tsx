import { Navbar } from "./navbar";

const Home = ()=>{
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 z-10 h-16 left-0 right-0 bg-white p-4">
      <Navbar/>
      </div>
      <div className="mt-16">

      </div>
    </div>
  )
}

export default Home;