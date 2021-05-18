import 'package:flutter/cupertino.dart';
import 'package:health/health.dart';
import 'package:healthapp/services/google_fit_service.dart';

class GoogleFitDataViewModel extends ChangeNotifier{
  List<HealthDataPoint> health;

  void googleFit() async {
    health = await GoogleFitService().fetchDetails();
    notifyListeners();
  }
}