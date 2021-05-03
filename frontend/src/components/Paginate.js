import React from 'react'
import { Pagination } from 'react-bootstrap'
import { Link, LinkContainer } from 'react-router-bootstrap'

const Paginate = ({ pages, page, isAdmin = 'false', keyword = '' }) => {
    
    // if number of pages > 1
    return pages > 1 && (
        <Pagination>
            {[...Array(pages).keys()].map(x => (
                <LinkContainer key={x + 1} to={
                    !isAdmin ? (
                        keyword ? (
                            `/ search / ${keyword}/page/${x + 1}`
                        ) : `/page/${x + 1}`)
                        : (
                            `/admin/productslist/${x+1}`
                    )}>
                    <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                </LinkContainer>
            ))}
        </Pagination>
    )
}

export default Paginate

// add this to HomeScreen.js