import 'package:flutter/material.dart';
import 'package:healthapp/config.dart';
import 'package:healthapp/views/PillBox/PillBoxBody.dart';

class PillBox extends StatelessWidget {
  const PillBox({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConfig().backGroundColor,
      appBar: AppBar(
        elevation: 0,
        title: Text(
          "Pill Box",
          style: TextStyle(color: Colors.black),
        ),
        backgroundColor: AppConfig().backGroundColor,
        leading: Icon(
          Icons.arrow_back_ios_outlined,
          color: Colors.black,
        ),
      ),
      body: PillBoxBody(),
    );
  }
}
