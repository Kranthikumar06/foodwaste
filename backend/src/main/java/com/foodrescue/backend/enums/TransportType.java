package com.foodrescue.backend.enums;
public enum TransportType {
    BICYCLE(10), BIKE_WITH_BOX(20), CAR(50), VAN(150);
    private final int capacityKg;
    TransportType(int c) { this.capacityKg = c; }
    public int getCapacityKg() { return capacityKg; }
}
