package com.fooddelivery.service.simulation;

import com.fooddelivery.entity.Order;
import com.fooddelivery.repository.OrderRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import jakarta.transaction.Transactional;

@Configuration
// It activates it globally for the whole application context, so
// all scheduled functions in all classes will be activated. The job runs as a
// system process in the background, independent of user interactions, so it
// will keep running as long as the application is up.
@EnableScheduling
public class OrderStatusSimulationService {

    private OrderRepository orderRepository;

    public OrderStatusSimulationService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // For the methods this starts a database transaction, so that all the database
    // operations within the method are executed in a single transaction.
    @Transactional
    // This marks the method to be executed on a schedule. The fixedDelay means that
    // the next execution will be scheduled after the previous execution finishes,
    // with a delay of 2 seconds in this case. The scheduler taks runs independently
    // of HTTP requests, so it will keep running in the background as long as the
    // application is up. But it shares the same database and the same application
    // context, so it can read and update the same orders as the rest of the
    // application.
    @Scheduled(fixedDelay = 2000, timeUnit = TimeUnit.MILLISECONDS)
    public void advanceOpenOrderStatuses() {
        System.out.println("OrderStatusSimulationService_advanceOpenOrderStatuses().");

        // Poll all non-final orders every 2 seconds and advance them through
        // demo lifecycle states based on elapsed time.
        List<Order> openOrders = orderRepository.findOpenOrders();
        // [Order [id=5, totalAmount=1, totalCost=13.80, status=PREPARING,
        // createdAt=2026-04-03T10:54:54.735360, paymentMethod=null, paymentStatus=null,
        // deliverySnapshot=DeliverySnapshot [name=null, userId=1, phoneNumber=2222,
        // label=Home, streetName=Tardisgasse, postalCode=20, city=Vienna,
        // country=Austria]]]
        // If there are no open orders, then the list will be empty.
        System.out.println("OrderStatusSimulationService_advanceOpenOrderStatuses()_openOrders: " + openOrders);

        if (openOrders.isEmpty()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        List<Order> updatedOrders = new ArrayList<>();
        System.out.println("OrderStatusSimulationService_advanceOpenOrderStatuses()_updatedOrders: " + updatedOrders);
        for (Order order : openOrders) {
            // Defensive guard: skip incomplete rows instead of failing the whole job.
            if (order.getCreatedAt() == null || order.getStatus() == null) {
                continue;
            }

            Order.Status nextStatus = resolveStatusByElapsedSeconds(order.getCreatedAt(), now);
            // Only if the status has actually changed then update it.
            if (nextStatus != order.getStatus()) {
                // Persist only real changes to avoid unnecessary write load.
                order.setStatus(nextStatus);
                updatedOrders.add(order);
            }
        }

        // Once all orders have been processed, save the ones that had real changes.
        if (!updatedOrders.isEmpty()) {
            // Batch update is more efficient than saving each order individually.
            orderRepository.saveAll(updatedOrders);
            // [Order [id=5, totalAmount=1, totalCost=13.80, status=DELIVERED,
            // createdAt=2026-04-03T10:54:54.735360, paymentMethod=null, paymentStatus=null,
            // deliverySnapshot=DeliverySnapshot [name=null, userId=1, phoneNumber=2222,
            // label=Home, streetName=Tardisgasse, postalCode=20, city=Vienna,
            // country=Austria]]]
            System.out.println(
                    "OrderStatusSimulationService_advanceOpenOrderStatuses()_updatedOrders_saved: " + updatedOrders);
        }
    }

    private Order.Status resolveStatusByElapsedSeconds(LocalDateTime createdAt, LocalDateTime now) {
        System.out.println("OrderStatusSimulationService_resolveStatusByElapsedSeconds().");

        long elapsedSeconds = Duration.between(createdAt, now).getSeconds();
        System.out.println(
                "OrderStatusSimulationService_resolveStatusByElapsedSeconds()_Elapsed seconds: " + elapsedSeconds);

        // Highest threshold first so later stages are matched correctly. If 20 were to
        // come first then the others will never be reached.
        if (elapsedSeconds >= 120) {
            return Order.Status.DELIVERED;
        }

        if (elapsedSeconds >= 60) {
            return Order.Status.OUT_FOR_DELIVERY;
        }

        if (elapsedSeconds >= 20) {
            return Order.Status.PREPARING;
        }

        return Order.Status.PLACED;

    }
}
