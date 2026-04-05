package com.hhcc.scheduling.client;

import com.hhcc.scheduling.dto.PaymentInvoiceRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "payment-service", url = "http://ms-payment-service:8082/api/v1")
public interface PaymentServiceClient {
    @PostMapping("/payment/invoices")
    void createPaymentInvoice(@RequestBody PaymentInvoiceRequest request);
}
