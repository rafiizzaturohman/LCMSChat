import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());
	app.enableCors({
		origin: "http://localhost:3000",
		credentials: true,
	});
	app.useGlobalPipes(new ValidationPipe());

	await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
