import 'package:flutter/material.dart';
import 'package:healthapp/config.dart';
import 'package:healthapp/views/HomePage/HomePageBody.dart';
import 'package:percent_indicator/percent_indicator.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConfig().backGroundColor,
      body: HomePageBody(),
    );
  }
}
