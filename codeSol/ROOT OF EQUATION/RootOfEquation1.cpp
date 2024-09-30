#include <iostream>
#include <cmath>
#include <iomanip>

using namespace std; 
// Graphical Method
double f(double x) {
    return x*x - 2;
}

int main() {
    double step = 1;
    double x_start = 0;
    double x_end = 5;
    double tolerance = 0.000001;
    double y,z;
    for(int i = x_start; i <= x_end; i+=step) {
        if(f(i) * f(i + step) <= 0) {
            y = i;
            z = i+1;
            step /= 10;
            break;
        }
    }

    while(step != tolerance) {
        for(double i = y; i <= z; i+=step) {
            if(f(i) * f(i + step) <= 0 || step <= tolerance) {
                y = i;
                z = i+1;
                step /= 10;
                break;
            }
        }

        if(step <= tolerance) {
            break;
        }
    }

    double xroot = 0;
    for(double i = y; i <= z; i+= step) {
        
        if(f(i) == 0.0 || f(i) * f(i + 0.000001) <= 0) {
            cout << "i : " << i << endl;
            cout << fixed << setprecision(6) << f(i) << " : " << fixed << setprecision(6) << f(i + 0.000001) << endl;
            xroot = i;
            break;
        }
        
    }

    cout << "root is " << fixed << setprecision(6) << xroot << endl;

    return 0;
}