import {useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";


function PageWrapper ({children}) {
    const accessToken = useSelector((state) => state.user.access);
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) {
            navigate("/");
        }
    }, [accessToken]);

    return <>{children}</>
}

export default PageWrapper;
