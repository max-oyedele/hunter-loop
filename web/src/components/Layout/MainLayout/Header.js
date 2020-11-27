import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, Modal, Container, Button } from "reactstrap";
import { Icons } from '../../../constants';

import defaultUserImg from '../../../assets/images/defaultUserImg.png';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: '',
      params: '',
      user: ''
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount() {
    const { match: { path } } = this.props;
    const { match: { params } } = this.props;
    this.setState({
      path: path,
      params: params
    });

    let user = this.props.auth.user;
    if (!user){
      user = JSON.parse(localStorage.getItem("authUser"))      
    }
    this.setState({user: user});    
  }



  toggleMenu() {
    this.props.toggleMenuCallback();
  }

  render() {
    let storeUser = this.props.auth.user;
    let role = storeUser && storeUser.role;
    if(!role){
      let storageUser = JSON.parse(localStorage.getItem("authUser"));
      role = storageUser && storageUser.role;
    }

    return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">

              <div className="navbar-brand-box">
                <div className="d-flex align-items-center ml-3">
                  <button type="button" onClick={this.toggleMenu} className="btn btn-sm font-size-16 header-item waves-effect" id="vertical-menu-btn">
                    <i className={`${Icons.menu}`}></i>
                  </button>
                  <CardImg src={this.state.user.img ? this.state.user.img : defaultUserImg} alt="No Image" className="profileImg ml-2 rounded-circle avatar-sm border border-white" style={{ width: 40, height: 40 }} />
                  <div className="ml-2 profileLabel">
                    <span className="text-white">Welcome, {this.state.user.name ? this.state.user.name.split(" ")[0] + '!' : this.state.user.role + '!'}</span>
                    <br />
                    <span className="font-size-14 text-secondary">version 1.00</span>
                  </div>
                </div>

              </div>

              {
                role === 'business' &&
                <div className="d-flex align-items-center ml-4">
                  {
                    this.state.path === '/profile' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.profile} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">PROFILE</span>
                    </div>
                  }
                  {
                    this.state.path === '/profile/edit' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.profile} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">EDIT PROFILE</span>
                    </div>
                  }
                  {
                    this.state.path === '/services' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.services} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">SERVICES</span>
                    </div>
                  }
                  {
                    (this.state.path === '/services/add' || this.state.path === '/services/edit') &&
                    <>
                      <div className="d-flex align-items-center">
                        <i className={`${Icons.services} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                        <span className="font-size-20 text-white ml-3">SERVICES</span>
                      </div>
                    </>
                  }
                  {
                    this.state.path === '/chat' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.messages} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">MESSAGES</span>
                    </div>
                  }
                  {
                    this.state.path === '/socialupdate' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.socialUpdate} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">SOCIAL UPDATE</span>
                    </div>
                  }
                  {
                    this.state.path === '/settings' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.settings} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">SETTINGS</span>
                    </div>
                  }

                </div>
              }
              {
                role === 'admin' &&
                <div className="d-flex align-items-center ml-4">
                  {
                    this.state.path === '/admin/reports' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.reports} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">REPORTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/reports/detail' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.reports} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">REPORTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/users/all' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.allUsers} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">All USERS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/users/banned' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.bannedUsers} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">BANNED USERS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/businessaccounts' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.businessAccounts} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">BUSINESS ACCOUNTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/businessaccounts/requests' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.businessAccounts} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">BUSINESS ACCOUNTS REQUESTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/businessaccounts/requests/detail' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.businessAccounts} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">BUSINESS ACCOUNTS REQUESTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/businessaccounts/view' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.businessAccounts} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">VIEW BUSINESS ACCOUNTS</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/pricing' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.pricing} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">PRICING</span>
                    </div>
                  }
                  {
                    this.state.path === '/admin/changepwd' &&
                    <div className="d-flex align-items-center">
                      <i className={`${Icons.changePwd} color-yellow font-size-16`} style={{ color: '#f7d907' }}></i>
                      <span className="font-size-20 text-white ml-3">ChANGE PASSWORD</span>
                    </div>
                  }
                </div>
              }

            </div>
          </div>
        </header>

      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return {
    ...state
  };
};

export default connect(mapStatetoProps, {

})(withRouter(Header));
