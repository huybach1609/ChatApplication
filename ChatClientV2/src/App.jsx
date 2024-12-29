import {Navbar} from "./component/default/NaviticationBar.jsx";
import {useEffect, useState} from "react";
import {useMediaQuery} from "react-responsive";
import {motion} from "framer-motion";
import {
    Button,
    makeStyles,
} from "@fluentui/react-components";
import {BrowserRouter as Router } from 'react-router-dom'
import {AppProvider } from "./component/contexts/AppContext.jsx";
import {AppRouter} from "./routes/AppRouter.jsx";
import {Sidebar} from "./component/default/Sidebar.jsx";
import {LayoutColumnOneThirdLeft20Regular, LayoutColumnOneThirdRightHint20Regular} from "@fluentui/react-icons";
import {StompClientProvider} from "./component/contexts/StompClientContext.jsx";
import {API_URL} from "../Constains.jsx";


// sm	640px	@media (min-width: 640px) { ... }
// md	768px	@media (min-width: 768px) { ... }
// lg	1024px	@media (min-width: 1024px) { ... }
// xl	1280px	@media (min-width: 1280px) { ... }
// 2xl	1536px	@media (min-width: 1536px) { ... }

const useStyles = makeStyles({
    root: {
        color: 'var(--colorNeutralForeground1)',
        padding: '0',
        margin: '0',
        width: '100vw',
        height: '100vh',
        // borderRadius: 'var(--borderRadiusMedium)',
        display: 'flex'
    },
    direction: {
        padding: "10px 0 10px 0",
        backgroundColor: 'var(--colorNeutralBackground3)',
        width: '50px',
        zIndex: '9',
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center"
    },
    nav: {
        backgroundColor: 'var(--colorNeutralBackground1)',
        width: '300px',
        zIndex: '10',
        boxShadow: 'var(--shadow4)',
        '@media (max-width: 768px)': { // sm
            zIndex: '10',
            position: 'absolute',
            height: '100vh',
            width: '300px',
        },
    },
    other: {
        backgroundColor: 'var(--colorNeutralBackground1)',
        flexGrow: '1',
        '@media (max-width: 768px)': { // sm,
            flexGrow: '1'
        },
        height: "100%",
        display:"flex",
        flexWrap: "wrap"
    },
    buttonToggle: {
        zIndex: '20',
        position: "absolute",
        left: "8px",
        top: "10%"
    }
});

function App() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const classes = useStyles();
    const variants = {
        open: {opacity: 1, x: 0},
        closed: {opacity: 0, x: "-90%"}
    }

    const isSm = useMediaQuery({query: '(min-width: 768px)'});

    useEffect(() => {
        if (isSm) {
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
    }, [isSm]);


    return (
            <AppProvider>
                <StompClientProvider url={API_URL}>

                <Router>
                    <div className={classes.root}>
                        {/*direction*/}
                        {!isSm ?
                            <Button className={classes.buttonToggle}
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    icon={!isSidebarOpen?<LayoutColumnOneThirdLeft20Regular/>:<LayoutColumnOneThirdRightHint20Regular/>}
                                    style={{backgroundColor:"var(--colorSubtleBackgroundLightAlphaHover)"}}
                            ></Button>
                            :
                            null
                        }
                        <div className={classes.direction}>
                            <Sidebar/>
                        </div>

                        {/*navbar*/}
                        <motion.nav
                            animate={isSidebarOpen ? "open" : "closed"}
                            variants={variants}
                            transition={{ease: "anticipate"}}
                            // ${isSidebarOpen ? "" : "hidden"}
                            className={classes.nav}>
                            <Navbar/>
                        </motion.nav>
                        {/*other*/}
                        <div className={classes.other}>
                            <AppRouter/>
                        </div>
                    </div>
                </Router>
                </StompClientProvider>
            </AppProvider>
    )
}

export default App
