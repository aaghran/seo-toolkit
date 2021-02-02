import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Collapse, Button, CardBody, Card } from "reactstrap";
import { Jumbotron } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import "bootstrap/dist/css/bootstrap.css";
import "./scss/index.scss";

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
  let title = (
    <p>
      <a href={`//${row.url.replace("//","")}`} target="blank" className="text-danger">
        {row.url.replace("//","")}
      </a>
    </p>
  );
  if (row.seo && row.seo.title) {
    title = row.seo.title.map((page, i) => (
      <p>
        <a href={`//${row.url}`} target="blank" className="text-success">
          {page}
        </a>
      </p>
    ));
  }
  return title;
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
      sort: true,
    },
    {
      dataField: "metatags",
      text: "meta",
      formatter: (value, row, rowIndex) => (
        <span>{row.internalLinks && row.metatags.length}</span>
      ),
      sort: true,
    },
    {
      dataField: "internalLinks",
      text: "links",
      formatter: (value, row, rowIndex) => (
        <span>{row.internalLinks && row.internalLinks.length}</span>
      ),
      sort: true,
    },
    {
      dataField: "images",
      text: "images",
      formatter: (value, row, rowIndex) => (
        <span>{row.seo && row.seo.images && row.seo.images.length}</span>
      ),
      sort: true,
    },
    {
      dataField: "pageMetrics",
      text: "metrics",
      formatter: (value, row, rowIndex) => (
        <span>{row.pageMetrics && row.pageMetrics.TaskDuration}</span>
      ),
      sort: true,
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
      <Container fluid>
        <Row>
          <Col sm="12">
            <h2>Wandering Bong</h2>
            <Button color="danger" outline>Sitemap</Button>
            <Button color="success" outline>Export</Button>
          </Col>
          <Col sm="12">
            <h3>All URLs</h3>
          </Col>
          <Col sm="12">
            <BootstrapTable
              keyField="id"
              className="results"
              data={websiteData.data}
              columns={columns}
              striped
              hover
              condensed
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
