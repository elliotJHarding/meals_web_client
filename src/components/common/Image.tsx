import { motion } from "framer-motion";
import {useState} from "react";

export default function Image({ src }: { src: string | undefined }) {
   const [loading, setLoading] = useState<boolean>(true);

   const handleOnLoad = () => setLoading(false);

    return (
        <motion.img
            src={src}
            transition={{opacity:{ duration: 0.5 } }}
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            onLoad={handleOnLoad}
        />
    )
}