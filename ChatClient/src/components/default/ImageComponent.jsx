import {useEffect, useState} from 'react';

// eslint-disable-next-line react/prop-types
const ImageComponent = ({ src, alt, style }) => {
    const [imgSrc, setImgSrc] = useState(src);
    useEffect(() => {
       if(imgSrc == null){
        setImgSrc('/src/assets/blank/blank-profile-picture.webp') ;
       }
    }, [imgSrc]);

    const handleError = () => {
        setImgSrc('/src/assets/blank/blank-profile-picture.webp');
    };

    return (
        <img
            src={imgSrc}
            className={style}
            onError={handleError}
        />
    );
};

export default ImageComponent;