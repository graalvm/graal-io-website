The application consists of three microservices:

* _users_ - contains customer data that can place orders on items, also a new customer can be created. It requires HTTP basic authentication to access it.
* _orders_ - contains all orders that customers have created as well as available items that customers can order. This microservice also enables the creation of new orders. It requires HTTP basic authentication to access it.
* _api_ - acts as a gateway to the _orders_ and _users_ microservices. It combines results from both microservices and checks data when a customer creates a new order.