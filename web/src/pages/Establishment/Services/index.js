import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, CardHeader, Collapse, Modal, Container, Button } from "reactstrap";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import StarRatings from 'react-star-ratings';

import { getData } from '../../../store/actions';

import { Icons } from '../../../constants';

import ServiceItem from './components/ServiceItem';
import ServiceForm from './ServiceForm';

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseForHuntersGuide: true,
      business: '',
      services: [],
    }
  }

  componentDidMount() {
    this.props.getData('business');
    this.props.getData('services');
    this.props.getData('categories');
  }

  componentDidUpdate(prevProps, prevState) {
    let user = this.props.auth.user;
    if (!user) {
      user = JSON.parse(localStorage.getItem("authUser"));
    }

    let business = prevProps.data.business.length > 0 && prevProps.data.business.find((each) => each.id == user.bid);
    if (prevState.business != business) {
      this.setState({ business: business })
    }
    if(!business) return;

    let services = this.props.data.services.filter((each) => each.bid == business.id);    
    if (prevState.services.length != services.length) {//mounting, refreshing 
      this.setState({
        business: business,
        services: services
      })
    }
    if(prevProps.data.success != this.props.data.success){//return after adding, deleting or edit
      this.props.getData('services');
    }
  }

  toggleHuntersGuide = () => {
    // this.setState({ collapseForHuntersGuide: !this.state.collapseForHuntersGuide });
  }

  renderLoading = () => {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: 'transparent', width: '80%', height: '80vh', position: 'absolute', zIndex: 1005 }}>
        <div className="spinner-border text-primary m-1" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          {
            this.props.data.loading && this.renderLoading()
          }
          <Container fluid>
            <div className="d-flex justify-content-end mb-3" style={{ position: 'fixed', top: 15, right: 15, zIndex: 1100 }} >
              <div className="d-flex align-items-center">
                <Button
                  color='#f7d907'
                  className="btn waves-effect waves-light"
                  style={{ backgroundColor: '#f7d907', width: 85 }}
                  onClick={() => this.props.history.push('/services/add')}
                >
                  <b className="text-dark">ADD</b>
                </Button>
              </div>
            </div>
            <Row>
              <Col className="col-4">
                <Card className="mb-0">
                  <Row className="no-gutters align-items-center">
                    <Col className="col-12">
                      <CardImg className="img-fluid p-3" src={this.state.business.img} alt="No Image" style={{ borderRadius: 25 }} />
                    </Col>
                    <Col className="col-12">
                      <CardBody className="pt-0">
                        <CardText className="font-size-20 mb-0"><b>{this.state.business.name}</b></CardText>
                        <div className="d-flex">
                          <StarRatings
                            rating={this.state.business.rating}
                            starRatedColor="#F1B44C"
                            starEmptyColor="#2D363F"
                            numberOfStars={5}
                            name='rating'
                            starDimension="14px"
                            starSpacing="3px"
                          />
                          <CardText className="ml-2 mt-1">{this.state.business.rating}</CardText>
                        </div>
                      </CardBody>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col className="col-8 px-0" style={{ backgroundColor: '#ffffff' }}>
                <CardHeader id="headingOne" className="pb-0" onClick={this.toggleHuntersGuide} style={{ backgroundColor: '#ffffff', cursor: 'pointer' }}>
                  <CardTitle>Hunters Guide</CardTitle>
                  <hr className="my-1" />
                </CardHeader>

                <Collapse isOpen={this.state.collapseForHuntersGuide}>
                  <CardBody className="py-0">
                    {
                      this.state.services && this.state.services.map((each, index) => {                        
                        return (
                          <div key={index}>
                            <ServiceItem collapse={index == 0 ? true : false} service={each} />
                            <hr className="my-2" />
                          </div>
                        )
                      })
                    }
                  </CardBody>
                </Collapse>
              </Col>
            </Row>
          </Container>
        </div>
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
  getData
})(withRouter(Services));

