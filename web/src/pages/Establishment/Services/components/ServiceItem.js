import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, CardImg, CardText, CardHeader, Collapse, Modal, Container } from "reactstrap";

import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { getData, setData } from '../../../../store/actions';

import { Icons } from '../../../../constants';
import ServiceViewModal from "./ServiceViewModal";

class ServiceItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      service: this.props.service,
      collapse: this.props.collapse ? this.props.collapse : false,
      previewModal: false
    }
  }

  toggleCollapse = () => {
    this.setState({ collapse: !this.state.collapse });
  }

  togglePreviewModal = () => {
    this.setState({ previewModal: !this.state.previewModal });
  }

  onIcon = (icon) => {
    if (icon === 'eye') {
      this.togglePreviewModal();
    }
    else if (icon === 'edit') {
      this.props.history.push('/services/edit', { serviceId: this.state.service.id })
    }
    else if (icon === 'delete') {
      var { services } = this.props.data;
      services.splice(services.findIndex(each => each.id == this.state.service.id), 1);
      this.props.setData('services', 'delete', services, this.state.service);
    }
  }

  render() {
    if(!this.props.data.categories) return;
    const category = this.props.data.categories.find(each=>each.id == this.state.service.cid);
    if(!category) return null;
    return (
      <React.Fragment>       
        <CardHeader id="headingOne" className="pb-0 d-flex justify-content-between" style={{ backgroundColor: '#ffffff' }}>
          <CardTitle className="text-secondary" onClick={this.toggleCollapse} style={{ cursor: "pointer" }}>
            {
              this.state.collapse ? 
                <i className={`${Icons.arrowDown} font-size-16 mr-2`}></i>
              : 
                <i className={`${Icons.arrowRight} font-size-16 mr-2`}></i>
            }            
            Sub-category: {category.name.toUpperCase()}
          </CardTitle>
          <div id="rightIcons">
            <i className={`${Icons.eye} font-size-14 mr-3`} style={{ cursor: "pointer" }} onClick={() => this.onIcon('eye')}></i>
            <i className={`${Icons.pencil} font-size-14 mr-3`} style={{ cursor: "pointer" }} onClick={() => this.onIcon('edit')}></i>
            <i className={`${Icons.trash} font-size-14 text-danger`} style={{ cursor: "pointer" }} onClick={() => this.onIcon('delete')}></i>
          </div>
        </CardHeader>

        <Collapse isOpen={this.state.collapse}>
          <CardBody className="py-0">
            <Row id="table-header" className="mt-2">
              <Col className="col-2 font-size-11"><i><b>Title</b></i></Col>
              <Col className="col-6 font-size-11"><i><b>DESCRIPTION</b></i></Col>
              <Col className="col-3 font-size-11"><i><b>HUNTING SEASON</b></i></Col>
              <Col className="col-1 font-size-11"><i><b>DETAILS</b></i></Col>
            </Row>
            <Row id="table-body" className="text-secondary">
              <Col className="col-2">{this.state.service.name}</Col>
              <Col className="col-6">{this.state.service.about}</Col>
              <Col className="col-3">{this.state.service.season.from} - {this.state.service.season.to}</Col>
              <Col className="col-1">
                <div className="d-flex align-items-center">
                  <i className={`${Icons.profile} mr-1`}></i>
                  <span>{this.state.service.hunters}</span>
                  <i className={`${Icons.calendar} ml-3 mr-1`}></i>
                  <span>{this.state.service.days}</span>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Collapse>

        <ServiceViewModal isOpen={this.state.previewModal} toggle={this.togglePreviewModal} service={this.state.service} />
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
  getData, setData
})(withRouter(ServiceItem));

