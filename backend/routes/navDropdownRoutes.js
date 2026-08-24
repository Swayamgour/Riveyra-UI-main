const express = require('express');
const { getNavDropdownItems, getNavDropdownItemByCategory, createNavDropdownItem, updateNavDropdownItem, deleteNavDropdownItem } = require('../controllers/navDropdownController');

const router = express.Router();

router.route('/')
    .get(getNavDropdownItems)
    .post(createNavDropdownItem);

router.route('/category/:categories')
    .get(getNavDropdownItemByCategory);

router.route('/:id')
    .put(updateNavDropdownItem)
    .delete(deleteNavDropdownItem);

module.exports = router;
