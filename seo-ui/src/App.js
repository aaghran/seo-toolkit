import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Collapse, Button, CardBody, Card } from "reactstrap";
import { Jumbotron } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "bootstrap/dist/css/bootstrap.css";
import "./scss/nextjs-argon-dashboard.scss";
import "./App.css";

function h1Formatter(cell, row) {
  console.log(row);
  return (
    row.seo &&
    row.seo.h1 &&
    row.seo.h1.map((page, i) => <li>{JSON.stringify(page)}</li>)
  );
}

function h2Formatter(cell, row) {
  console.log(row);
  return (
    row.seo &&
    row.seo.h2 &&
    row.seo.h2.map((page, i) => <li>{JSON.stringify(page)}</li>)
  );
}

function titleFormatter(cell, row) {
  console.log(row);
  return (
    row.seo &&
    row.seo.title &&
    row.seo.title.map((page, i) => (
      <p>
        <a href={`//${row.url}`} target="blank">
          {page}
        </a>
      </p>
    ))
  );
}

const websiteData = require("./urls_wanderingbong.com.json");

const App = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const columns = [
    {
      dataField: "url",
      text: "URL",
      formatter: titleFormatter,
    },
    {
      dataField: "metatags",
      text: "metatags",
      formatter: (value, row, rowIndex) => (
        <span>{row.internalLinks && row.metatags.length}</span>
      ),
    },
    {
      dataField: "internalLinks",
      text: "internalLinks",
      formatter: (value, row, rowIndex) => (
        <span>{row.internalLinks && row.internalLinks.length}</span>
      ),
    },
    {
      dataField: "images",
      text: "images",
      formatter: (value, row, rowIndex) => (
        <span>{row.seo && row.seo.images && row.seo.images.length}</span>
      ),
    },
    {
      dataField: "pageMetrics",
      text: "pageMetrics",
      formatter: (value, row, rowIndex) => (
        <span>{row.pageMetrics && row.pageMetrics.TaskDuration}</span>
      ),
    },
    {
      dataField: "h1",
      text: "h1",
      formatter: h1Formatter,
    },
    {
      dataField: "h2",
      text: "h2",
      formatter: h2Formatter,
    },
  ];

  return (
    <div className="App">
      <Jumbotron>
        <h1 className="display-3">SEO audit tool!</h1>
        <p className="lead">Check all links and track performance</p>
        {/* <p className="lead">
          <Button color="primary">Learn More</Button>
        </p> */}
      </Jumbotron>
      <Container>
        <Row>
          <Col sm="12">
            <h1>Wandering Bong</h1>
          </Col>
          <Col sm="12">
            <BootstrapTable
              keyField="id"
              data={websiteData.data}
              columns={columns}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
