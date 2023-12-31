import React, { useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  deleteProductById,
  getProducts,
  updateProductStatus,
} from "../../actions";
import Layout from "../../components/Layout";
import Input from "../../components/UI/Input";
import Modal from "../../components/UI/Modal";
import { generatePublicUrl } from "../../urlConfig";
import { IoIosAdd } from "react-icons/io";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import {
  faBan,
  faCircleInfo,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";

/**
 * @author
 * @function Products
 **/

export const Products = (props) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [discountOnQuantity, setDiscountOnQuantity] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productPictures, setProductPictures] = useState([]);
  const [show, setShow] = useState(false);
  const [productDetailModal, setProductDetailModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const category = useSelector((state) => state.category);
  const product = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [productStatus, setProductStatus] = useState(product.productStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productStatusError, setProductStatusError] = useState(null);

  const handleClose = () => {
    const form = new FormData();
    form.append("name", name);
    form.append("quantity", quantity);
    form.append("price", price);
    form.append("description", description);
    form.append("category", categoryId);
    form.append("discountOnQuantity", discountOnQuantity);
    form.append("discountPercentage", discountPercentage);
    console.log(productPictures)
    for (let pic of productPictures) {
      form.append("productPicture", pic);
    }
    dispatch(addProduct(form));
    setName("");
    setQuantity("");
    setPrice("");
    setDescription("");
    setCategoryId("");
    setProductPictures([]);
    setDiscountOnQuantity("")
    setDiscountPercentage("")
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({
        value: category._id,
        name: category.name,
      });
      if (category.children.length > 0) {
        createCategoryList(category.children, options);
      }
    }
    return options;
  };
  const handleProductPicture = (e) => {
    setProductPictures([...productPictures, e.target.files[0]]);
  };

  // const handleProductStatusChange = (newStatus, productId) => {
  //   dispatch(updateProductStatus(productId, newStatus))
  //     .then((result) => {
  //       setProductStatus(newStatus);
  //       console.log(newStatus);
  //       console.log(productId);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const handleProductStatusChange = async (status, productId) => {
    try {
      setIsUpdating(true);
      setProductStatusError(null);
      dispatch(updateProductStatus(productId, status));
      console.log(productId);
      console.log(status);
    } catch (error) {
      setProductStatusError(error.response?.data?.message || error.message);
      console.error(error);
      if (error.response?.status === 404) {
        console.log("Product not found");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const renderProducts = () => {
    return (
      <Table style={{ fontSize: 12 }} responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Total Review</th>
            <th>Total Rating</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {product.products.length > 0
            ? product.products.map((product, index) => {
                if (auth.user.email == "muhammadhamza11@gmail.com") {
                  return (
                    <tr key={product._id} index={index}>
                      <td style={{textAlign:'center'}}>{index + 1}</td>
                      <td style={{textAlign:'center'}}>{product.name}</td>
                      <td style={{textAlign:'center'}}>{product.price}</td>
                      <td style={{textAlign:'center'}}>{product.quantity}</td>
                      <td style={{textAlign:'center'}}>{product.category.name}</td>
                      <td style={{textAlign:'center'}}>{product.totalreview}</td>
                      <td style={{textAlign:'center'}}>{product.totalrating}</td>
                      <td style={{textAlign:'center'}}>
                      {product.ratings[0] && product.ratings[0].star ? (
                        product.ratings[0].star.toFixed(1)
                      ) : (
                        0
                      )}
                      </td>
                      <td style={{textAlign:'center'}}>{product.productStatus}</td>

                      <td style={{ display: "flex" }}>
                        <button
                          // onClick={() =>
                          //   handleProductStatusChange("active", product._id)
                          // }
                          onClick={() =>
                            handleProductStatusChange("active", product._id)
                          }
                          // disabled={isUpdating}
                        >
                          <FontAwesomeIcon icon={faToggleOn} />
                          Active
                        </button>
                        <button
                          className="mx-1"
                          // onClick={() =>
                          //   handleProductStatusChange("inactive", product._id)
                          // }
                          onClick={() =>
                            handleProductStatusChange("inactive", product._id)
                          }
                          // disabled={isUpdating}
                        >
                          <FontAwesomeIcon icon={faToggleOff} />
                          InActive
                        </button>
                        <button
                          onClick={() => showProductDetailsModal(product)}
                        >
                          <FontAwesomeIcon icon={faCircleInfo} />
                          INFO
                        </button>
                        <button
                          className="mx-1"
                          onClick={() => {
                            const payload = {
                              productId: product._id,
                            };
                            dispatch(deleteProductById(payload));
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                          DELETE
                        </button>
                      </td>
                    </tr>
                  );
                } else {
                  console.log(product.createdBy);
                  // if (product.productStatus[1] === "active") {
                  return (
                    <tr key={product._id} style={{textAlign:'center'}}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>{product.category.name}</td>
                      <td>{product.totalreview}</td>
                      <td>{product.totalrating}</td>
                      <td>
                      {product.ratings[0] && product.ratings[0].star ? (
                        product.ratings[0].star.toFixed(1)
                      ) : (
                        0
                      )}
                      </td>
                      <td>{product.productStatus}</td>
                      <td style={{width:'10%'}}>
                        <button
                          onClick={() => showProductDetailsModal(product)}
                          style={{marginLeft:'4px',width:'100%'}}
                        >
                          <FontAwesomeIcon icon={faCircleInfo} />
                          INFO
                        </button>
                        <button
                          className="mx-1"
                          onClick={() => {
                            const payload = {
                              productId: product._id,
                            };
                            dispatch(deleteProductById(payload));
                          }}
                          style={{marginLeft:'10px',width:'100%'}}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                          DELETE
                        </button>
                      </td>
                    </tr>
                  );
                  // }
                }
              })
            : null}
        </tbody>
      </Table>
    );
  };

  const renderAddProductModal = () => {

    return (
      <Modal
        show={show}
        handleClose={() => setShow(false)}
        modalTitle={"Add New Product"}
        onSubmit={handleClose}
      >
        <Input
          Label="Name"
          value={name}
          placeholder={`Product Name`}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          Label="Quantity"
          value={quantity}
          placeholder={`Quantity`}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <Input
          Label="Price"
          value={price}
          placeholder={`Price`}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          Label="Description"
          value={description}
          placeholder={`Description`}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          Label="Discount On Quantity"
          value={discountOnQuantity}
          placeholder={`Discount On Quantity`}
          onChange={(e) => setDiscountOnQuantity(e.target.value)}
        />
        <Input
          Label="Discount Percentage"
          value={discountPercentage}
          placeholder={`Discount Percentage`}
          onChange={(e) => setDiscountPercentage(e.target.value)}
        />
        <select
          className="form-control"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option>Select Category</option>
          {createCategoryList(category.categories).map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        {productPictures.length > 0
          ? productPictures.map((pic, index) => (
              <div key={index}> {pic.name}</div>
            ))
          : null}

        <input
          type="file"
          name="productPicture"
          onChange={handleProductPicture}
        />
      </Modal>
    );
  };

  const handleCloseProductDetailsModal = () => {
    setProductDetailModal(false);
  };
  const showProductDetailsModal = (product) => {
    setProductDetails(product);
    setProductDetailModal(true);
  };

  const renderProductDetailsModal = () => {
    if (!productDetails) {
      return null;
    }

    return (
      <Modal
        show={productDetailModal}
        handleClose={handleCloseProductDetailsModal}
        modalTitle={"Product Details"}
        size="lg"
      >
        <Row>
          <Col md="6">
            <label className="key">Name</label>
            <p className="value">{productDetails.name}</p>
          </Col>
          <Col md="6">
            <label className="key">Price</label>
            <p className="value">{productDetails.price}</p>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <label className="key">Quantity</label>
            <p className="value">{productDetails.quantity}</p>
          </Col>
          <Col md="6">
            <label className="key">Category</label>

            <p className="value">{productDetails.category.name}</p>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <label className="key">Description</label>
            <p className="value">{productDetails.description}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <label className="key">Product Pictures</label>

            <div style={{ display: "flex" }}>
              {productDetails.productPictures.map((picture) => (
                <div className="productImgContainer">
                  <img src={generatePublicUrl(picture.img)} />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Modal>
    );
  };

  return (
    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h1>Product</h1>
              <button
                className="form-control-sm"
                onClick={handleShow}
                style={{
                  backgroundColor: "#071F45",
                  color: "white",
                  border: "0",
                  margin: "0 5px",
                  fontSize: "14px",
                  borderRadius: "5px",
                }}
              >
                <IoIosAdd /> <span>Add Product</span>
              </button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>{renderProducts()}</Col>
        </Row>
      </Container>
      {renderAddProductModal()}
      {renderProductDetailsModal()}
    </Layout>
  );
};
