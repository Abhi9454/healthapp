import 'package:get_it/get_it.dart';
import 'package:healthapp/services/dialog_service.dart';
import 'package:healthapp/services/google_fit_service.dart';

GetIt locator = GetIt.instance;

void setupLocator() {
  locator.registerLazySingleton(() => DialogService());
  locator.registerLazySingleton(() => GoogleFitService());
}