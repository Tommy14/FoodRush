import Validator from 'validator';
import isEmpty from 'is-empty';
import {
  validateOrderPlaced,
  validateOrderDelivered,
  validateUserAccountCreated
} from './type.validator.js';

export default function validateNotification(data) {
  let errors = {};

  // Base structure validations
  data.recipient = data.recipient || {};
  data.recipient.email = !isEmpty(data.recipient.email) ? data.recipient.email : '';
  data.subject = !isEmpty(data.subject) ? data.subject : '';
  data.type = !isEmpty(data.type) ? data.type : '';
  data.data = data.data || {};

  if (Validator.isEmpty(data.recipient.email)) {
    errors.email = 'Email is required';
  } else if (!Validator.isEmail(data.recipient.email)) {
    errors.email = 'Invalid email';
  }

  if (Validator.isEmpty(data.subject)) {
    errors.subject = 'Subject is required';
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = 'Notification type is required';
  }

  if (typeof data.data !== 'object' || Object.keys(data.data).length === 0) {
    errors.data = 'Notification data is required';
  } else {
    let extra = {};

    switch (data.type) {
      case 'orderPlaced':
        extra = validateOrderPlaced(data.data);
        break;
      case 'orderDelivered':
        extra = validateOrderDelivered(data.data);
        break;
      case 'userAccountCreated':
        extra = validateUserAccountCreated(data.data);
        break;
      default:
        errors.type = 'Unsupported notification type';
    }

    Object.assign(errors, extra);
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
