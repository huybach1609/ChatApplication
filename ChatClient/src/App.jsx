import {NextUIProvider, Button } from '@nextui-org/react'
import NaviticationBar from './components/default/navbar'
import CustomRouter from './routers/router'
import {API_URL} from './constrains'
import {BrowserRouter as Router} from 'react-router-dom'
import {useEffect, useState} from 'react'
import {PanelLeftClose, PanelLeftOpen} from 'lucide-react'
import {StompClientProvider} from "./context/StompClientContext.jsx";
import {AppProvider} from "./context/AppContext.jsx";
import {motion} from "framer-motion";
import {useMediaQuery} from "react-responsive";


function App() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    const ToggleButton = () => {
        return (
            <Button
                isIconOnly
                className="sm:hidden p-2 m-2 bg-blue-900/20 rounded absolute z-[99] hover:text-black hover:bg-blue-300 text-white/30"
                onClick={toggleSidebar}
            >
                {isSidebarOpen ?
                    <PanelLeftClose/>
                    :
                    <PanelLeftOpen/>
                }
            </Button>
        );

    }
    const variants = {
        open: {opacity: 1, x: 0},
        closed: {opacity: 0, x: "-90%"}
    }
    const isSm = useMediaQuery({query: '(min-width: 640px)'});

    useEffect(() => {
        if (isSm) {
            setIsSidebarOpen(true);
        }

    }, [isSm]);
    return (
        <NextUIProvider className='h-full w-full flex flex-col'>
                <Router>
                    <AppProvider>
                        <StompClientProvider url={API_URL}>
                            <div className='h-full w-full flex '>
                                <ToggleButton/>
                                {/* side bar */}
                                <motion.nav
                                    animate={isSidebarOpen ? "open" : "closed"}
                                    variants={variants}
                                    transition={{ease: "anticipate"}}
                                    // ${isSidebarOpen ? "" : "hidden"}
                                    className={`sm:w-[300px] w-[50%] pt-5 px-5 flex flex-col gap-2 h-[100vh]   sm:flex sm:static absolute z-20 backdrop-blur bg-stone-200/40 sm:bg-white`}>
                                    <NaviticationBar/>
                                </motion.nav>
                                {/* right path  */}
                                <div className="flex-1">
                                    {/* Router */}
                                    <CustomRouter/>
                                </div>
                            </div>
                        </StompClientProvider>
                    </AppProvider>
                </Router>
        </NextUIProvider>
    )
}

export default App
