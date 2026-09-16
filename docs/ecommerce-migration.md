# Ecommerce migration notes

The public product pages inspected use **Request a quote**, show made-to-order lead times and do not expose pricing or a direct cart checkout for the sampled products (Materia, Venus, Otto, Huf and Easy Wall). The new implementation preserves this model through quote CTAs and intentionally does not select an ecommerce provider.

Before a transaction flow is introduced, confirm with SERVOMUTO which catalogue items are directly purchasable, applicable territories, taxes, shipping, payment providers and existing Squarespace checkout behaviour.
