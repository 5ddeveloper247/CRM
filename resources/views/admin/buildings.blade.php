@extends('layouts.master.admin_template.master')

@push('css')
@endpush

@section('content')
<style>
table td {
    vertical-align: middle !important;
}

#buildings_table {
    font-size: x-small;
}

.table-responsive::-webkit-scrollbar {
    width: 5px;
    background-color: white;
    height: 5px;
}

.table-responsive::-webkit-scrollbar-thumb {
    background: #e8e8e8;
    /* Color of the scrollbar thumb */
    border-radius: 6px;
    /* Rounded corners of the scrollbar thumb */
}



.table-responsive {
    max-height: 5vh;
    overflow-y: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 9;
}
</style>

<section id="listing">
    <div class="contain-fluid">
        <ul class="crumbs">
            <li><a href="{{url('admin/dashboard')}}">Dashboard</a></li>
            <li>Buildings</li>
        </ul>
        <!-- <div class="card_row flex_row" style="justify-content:end"> -->
        <div class="card_row flex_row">
            <div class="col">
                <div class="card_blk">
                    <div class="icon" id="total_buildings"></div>
                    <strong>Total</strong>
                </div>
            </div>

            <div class="col">
                <div class="card_blk">
                    <div class="icon" id="resedential_type_builings"></div>
                    <strong>
                        Residential
                    </strong>
                </div>
            </div>
            <div class="col">
                <div class="card_blk">
                    <div class="icon" id="commercial_type_builings"></div>
                    <strong>Commercial</strong>
                </div>
            </div>
            <div class="col">
                <div class="card_blk">
                    <div class="icon" id="mixed_type_buildings"></div>
                    <strong>
                        Mixed
                    </strong>
                </div>
            </div>
            
            <div class="col">
                <div class="card_blk" id="add_building_btn">
                    <div class="icon"><img src="{{asset('assets/images/icon-plus.svg')}}" alt=""></div>
                    <strong>
                        Add Building
                    </strong>
                </div>
            </div>
        </div>
        <div class="top_head mt-5" style="float:right; ">

            <div class="form_blk">
                <input type="text" name="" id="searchInListing" class="text_box" placeholder="Search here">
                <button type="button"><img src="{{asset('assets/images/icon-search.svg')}}" alt=""></button>
            </div>
        </div>
        <div class="br"></div>
        <div class="top_head">


        </div>
        <div class="blk" style="margin-top:50px">
            <div class="tbl_blk">
                <table id="buildings_table" class="table table-responsive">
                    <thead>
                        <tr>
                            <th width="10">#</th>
                            <th>Image</th>
                            <th>Building Number</th>
                            <th>Building Name</th>
                            <th>Building Type</th>
                            <th width="40">No. Of Apartments</th>
                            <th width="40">No. Of Floors</th>
                            <th width="40">Building Address</th>
                            <th width="40">Status</th>
                            <th width="40">Action</th>

                        </tr>
                    </thead>
                    <tbody id="buildings_table_body">


                    </tbody>
                </table>
            </div>
        </div>

    </div>
</section>


<!-- delete modal start  -->
<div class="popup sm" data-popup="delete-data-popup" id="delete_modal">
    <div class="table_dv">
        <div class="table_cell">
            <div class="contain">
                <div class="_inner editor_blk">
                    <button type="button" class="hidden x_btn clode_delete_modal_default_btn"></button>
                    <h3 class="text-center">Are You Sure to Delete?</h3>
                    <!-- <p>Are You Sure to Delete?</p> -->
                    <div class="text-center row">
                        <button type="button" class="btn bg-transparent rounded-pill" id="delete_confirmed_btn"
                            data-id=""><img src="{{asset('assets\images\check_1828640.png')}}"
                                style="width:30px"></button>
                        <button type="button" class="btn bg-transparent rounded-pill" id="close_delete_modal_btn"><img
                                src="{{asset('assets\images\close-button_11450177.png')}}" style="width:30px"></button>

                        <!-- <button type="button" class="btn btn-danger ">Delete</button> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- delete modal end  -->
<script>
var url = '{{url(' / ')}}';
</script>


@endsection

@push('script')
<script src="{{ asset('assets_admin/customjs/script_admin_buildings.js') }}"></script>

@endpush