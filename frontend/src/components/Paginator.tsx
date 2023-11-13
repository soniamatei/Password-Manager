import React, {useState, useEffect, useContext} from 'react';
import {Button, IconButton, Tooltip} from "@mui/material";
import {Container} from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AuthContext from "../context/AuthProvider";

// @ts-ignore
const Pagination = ({ perPage, total, paginate, currPage}) => {

    // @ts-ignore
    const { user } = useContext(AuthContext);
    //Set number of pages
    // @ts-ignore
    const pagesList = []
    const pages = Math.ceil(total / perPage)
    for (let i = 1; i <= pages; i++) {
        pagesList.push(i)
    }

    // Current active button number
    const [currentButton] = useState(currPage)

    // Array of buttons what we see on the page
    const [arrOfVisibleButtons, setArrOfCurrButtons] = useState([])

    useEffect(() => {
        let tempNumberOfPages = [...arrOfVisibleButtons]
        let dotsInitial = '...'
        let dotsLeft = '... '
        let dotsRight = ' ...'

        if (pagesList.length < 6) {
            // @ts-ignore
            tempNumberOfPages = pagesList
        }

        else if (currentButton >= 1 && currentButton <= 3) {
            // @ts-ignore
            tempNumberOfPages = [1, 2, 3, 4, dotsInitial, pagesList.length]
        }

        else if (currentButton === 4) {
            // @ts-ignore
            const sliced = pagesList.slice(0, 5)
            // @ts-ignore
            tempNumberOfPages = [...sliced, dotsInitial, pagesList.length]
        }

        else if (currentButton > 4 && currentButton < pagesList.length - 2) {               // from 5 to 8 -> (10 - 2)
            // @ts-ignore
            const sliced1 = pagesList.slice(currentButton - 2, currentButton)                 // sliced1 (5-2, 5) -> [4,5]
            // @ts-ignore
            const sliced2 = pagesList.slice(currentButton, currentButton + 1)                 // sliced1 (5, 5+1) -> [6]
            // @ts-ignore
            tempNumberOfPages = ([1, dotsLeft, ...sliced1, ...sliced2, dotsRight, pagesList.length]) // [1, '...', 4, 5, 6, '...', 10]
        }

        else if (currentButton > pagesList.length - 3) {                 // > 7
            // @ts-ignore
            const sliced = pagesList.slice(pagesList.length - 4)       // slice(10-4)
            // @ts-ignore
            tempNumberOfPages = ([1, dotsLeft, ...sliced])
        }

        setArrOfCurrButtons(tempNumberOfPages)
    }, [currentButton])


    return (
        <><label>Per Page: {perPage}</label>
        <Container className="pagination-container">

            <IconButton
                href="#"
                disabled={currentButton === 1}
                onClick={() => paginate(currentButton - 1)}
            >
                <Tooltip title="Back" arrow>
                    <ArrowBackIosNewIcon color="primary" />
                </Tooltip>
            </IconButton>
            {arrOfVisibleButtons.map(((item, index) => {
                return <Button
                    href="#"
                    key={index}
                    disabled={currentButton === item || item === "... " || item === " ..." || item === "..."}
                    onClick={ () => {
                        paginate(item);
                    }}>
                    {item}
                </Button>
            }))}
            <Button
                href="#"
                disabled={currentButton === pages}
                onClick={() => paginate(currentButton + 1)}
            >
                <Tooltip title="Next" arrow>
                    <ArrowForwardIosIcon color="primary" />
                </Tooltip>
            </Button>
        </Container>
        </>
    );
}


export default Pagination

