#include <iostream>
#include <cmath>
#include <iomanip>

using namespace std;
//Bisection Method
double bisection(double xl, double xr);
double notRound(double result, int precision);
double function(double x);

int main() { //2.2 เขียนโปรแกรมโดยผลลัพธ์ที่ได้ไม่มีกํารเปลี่ยนแปลงจุดทศนิยม 6 ตำแหน่ง
    double xl = 1;
    double xr = 3;
    int precision = 6;

    double root = bisection(xl,xr);
    double result = notRound(root, precision);
   
    cout << "root is " << fixed << setprecision(precision) << result << endl;

    return 0;
}

double function(double x){
    return exp(x) - 8;
}

double notRound(double result, int precision) {
    double scale = pow(10.0, precision);
    return floor(result * scale) / scale;
}

double bisection(double xl, double xr) {
    double xm;
    double tolerance = 0.0000001;

    while (fabs(function(xm)) >= tolerance) {
        cout << "xl : " << xl << " xr : " << xr <<endl;
        
        xm = (xl + xr) / 2.0;
        double m  = function(xm);

        cout << "xm : " << xm <<endl;
        cout << "f(xm): " << fixed << setprecision(12) << function(xm) <<endl;
        cout << "m : " << m <<endl << endl;

        if(m == 0.0) {
            break;
        }else if(m * function(xr) < 0) {
            xl = xm;
        }else {
            xr = xm;
        }
        
    }

    return xm;
}