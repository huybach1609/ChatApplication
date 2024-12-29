import { useAnimate, usePresence } from "framer-motion"
import {useEffect} from "react";

const Component =()=> {
    const [isPresent, safeToRemove] = usePresence()
    const [scope, animate] = useAnimate()

    useEffect(() => {
        if (isPresent) {
            const enterAnimation = async () => {
                await animate(scope.current, { opacity: 1 })
                await animate("div", { opacity: 1, x: 0 })
            }
            enterAnimation()

        } else {
            const exitAnimation = async () => {
                await animate("div", { opacity: 0, x: -100 })
                await animate(scope.current, { opacity: 0 })
                safeToRemove()
            }

            exitAnimation()
        }
    }, [isPresent])

    return (
        <ul ref={scope}>
          <div className="p-2 bg-blue-200 text-black">hell</div>
        </ul>
    )
}
export default Component;