import { Router } from "express";
import multer from "multer";
import product from "../models/product.model.js";
import handlePolicies from "../middlewares/handle-policies.js";
import { ROLES } from "../config/auth.config.js";

const router = Router();

router.get("/", async (req, res) => {
  const { category = "", sort = "", page = 1 } = req.query;

  try {
    let filter = {};
    if (category) {
      filter.category = category;
    }

    let sortOrder = {};
    if (sort) {
      sortOrder[sort] = 1;
    }

    const itemsPerPage = 10;
    const skip = (page - 1) * itemsPerPage;

    const products = await product
      .find(filter)
      .sort(sortOrder)
      .skip(skip)
      .limit(itemsPerPage);

    res.json(products);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productFound = await product.findById(req.params?.pid);
    if (!productFound) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: productFound });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Crea un producto (Solo ADMIN)
router.post("/", handlePolicies([ROLES.ADMIN]), async (req, res) => {
  try {
    const newProduct = new product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ status: "success", payload: savedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Actualiza producto por ID (Solo ADMIN)
router.put("/:pid", handlePolicies([ROLES.ADMIN]), async (req, res) => {
  try {
    const updatedProduct = await product.findByIdAndUpdate(req.params?.pid, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Elimina producto por ID (Solo ADMIN)
router.delete("/:pid", handlePolicies([ROLES.ADMIN]), async (req, res) => {
  try {
    const deletedProduct = await product.findByIdAndDelete(req.params?.pid);
    if (!deletedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Crea producto con imagen (Solo ADMIN)
router.post("/upload", handlePolicies([ROLES.ADMIN]), upload.single("file"), async (req, res) => {
  const { name, price, category, stock, code, description, status } = req.body;

  if (!name || !price || !category || !stock || !code || !description) {
    return res.status(400).json({
      status: "error",
      message: "Todos los campos obligatorios deben ser completados.",
    });
  }

  let imagePath = req.file ? req.file.path : "";

  const newProduct = new product({
    name,
    price,
    category,
    stock,
    code,
    description,
    status: status ? true : false,
    image: imagePath,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json({
      status: "success",
      message: "Producto creado con éxito",
      payload: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al guardar el producto",
      error: error.message,
    });
  }
});

export default router;
