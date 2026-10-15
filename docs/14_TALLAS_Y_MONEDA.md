# Tallas y moneda

## Objetivos finales

- Guardar precios, pedidos y pagos en pesos colombianos (COP).
- Permitir visualizacion COP/USD desde el selector del encabezado.
- Gestionar tallas de prendas superiores, jeans, tenis y accesorios desde el panel admin.
- Validar tallas antes de crear el producto para evitar registros incompletos.

## Tallas en el panel admin

| Tipo | Opciones |
| --- | --- |
| Prenda superior | XS, S, M, L, XL, XXL |
| Jeans / pantalones | 28, 30, 32, 34, 36, 38, 40, 42 |
| Tenis | 35 a 45, talla EU |
| Accesorio | UNICA |

Cada opcion crea una fila en `tallas` con su `tipo` y una fila relacionada en `inventario`. El pedido conserva la talla elegida y el backend comprueba nuevamente su existencia y stock.

Desde el editor admin también se pueden cambiar datos, stock, tallas e imágenes. La acción de eliminar desactiva el producto (`activo = false`) para conservar la integridad de pedidos anteriores.

Los productos antiguos conservan el tipo predeterminado `ropa`, por lo que siguen siendo compatibles.

## Conversion de precios

`Producto.precio`, `precioAntes`, pedidos y pagos siempre se manejan en COP. USD solo cambia la presentacion. Configura la tasa en el frontend:

```env
NEXT_PUBLIC_USD_COP_RATE=4000
```

La tasa predeterminada es `4000 COP = 1 USD`. Actualizala segun la tasa que defina el negocio y reconstruye Next.js. Mercado Pago continua recibiendo `currency_id: "COP"`.

Mercado Pago recibe el total COP final calculado por el servidor. El webhook compara el importe confirmado con el pedido antes de marcarlo como pagado.

## Despliegue

1. Ejecutar `npx prisma migrate deploy` donde esta la base de datos.
2. Ejecutar `npx prisma generate` despues de actualizar Prisma.
3. Definir `NEXT_PUBLIC_USD_COP_RATE` y reconstruir el frontend.
4. Probar un producto de cada tipo, su stock, el cambio de moneda y un checkout antes de publicar.