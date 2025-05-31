import React, { useEffect } from 'react';

const AdsComponent = ({ dataAdSlot }) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {}
    }, []);

    return (
        <ins className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-2580569393176325"
            data-ad-slot={dataAdSlot}
            data-ad-format="auto"
            data-full-width-responsive="true">
        </ins>
    );
};

export default AdsComponent;