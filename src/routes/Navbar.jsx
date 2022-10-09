import React from 'react'

//navbar navbar-dark bg-dark navbar-expand-lg

export const Navbar = () => {
    return (
        <div className="container text-center pt-md-3 pt-4">

            <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">

                <div className="container-fluid justify-content-center" >
                    <span className="col-md-4 text-end nav-item text-secondary" >
                        {"<App Is>"}&nbsp; &nbsp; &nbsp; &nbsp;
                    </span>

                    <button className="navbar-toggler text-center " type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon "></span>
                    </button>

                    <div className="text-center col-md-4 collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="justify-content-center  col-md-12 navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link text-warning" href="#Home">
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-warning" href="#Apis">
                                    Apis
                                </a></li>
                            <li className="nav-item">
                                <a className="nav-link text-warning" href="#TecnoUsa">
                                    Tecnologias Usadas
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-warning" href="#TecnoUsa">
                                    Nosotros
                                </a>
                            </li>
                        </ul>

                    </div>
                    <span className="col-md-4 text-start nav-item text-secondary" >
                        &nbsp; &nbsp; &nbsp; &nbsp; {"</App Is>"}
                    </span>
                </div>
            </nav>
            <div className='column row'>
                <span className=' col-md-4'>

                </span>
                <hr className='m-0 col-md-4 text-center justify-content-center'></hr>
                <span className=' col-md-4'>

                </span>
            </div>


        </div>
    )
}
/*
<span className="nav-item text-secondary" >
                            {"<App Is>"}
                        </span>


        






































<div className="navbar-collapse collapse w-100 order-3 dual-collapse2 d-flex justify-content-end my-2 my-lg-0">
                    <ul className="navbar-nav mr-sm-2">
                        <span className='nav-item nav-link my-2 my-sm-0'>
                            Isaias
                        </span>
                    </ul>
                </div>


<a class="navbar-brand" href="#">Navbar</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Dropdown
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" href="#">Disabled</a>
                        </li>
                    </ul>
                    <form class="form-inline my-2 my-lg-0">
                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </div>
            











            <div className="container" >
                <Link className="navbar-brand" to="/">
                    App is
                </Link>

                <div className='collapse navbar-collapse'>
                    <div className=" navbar-nav">

                        <NavLink className="nav-item nav-link" to="/Imdb">
                            Imdb
                        </NavLink>

                        <NavLink className="nav-item nav-link" to="/VideoGames">
                            VideoGames
                        </NavLink>

                    </div>
                </div>

            </div>
            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2 d-flex justify-content-end">
                <ul className="navbar-nav ml-auto">
                    <span className='nav-item nav-link text-info'>
                        Isaias
                    </span>
                </ul>
            </div>
 */